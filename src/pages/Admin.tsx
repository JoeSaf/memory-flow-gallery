
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Photo } from '@/components/PhotoGallery';
import { Header } from '@/components/Header';

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    tag: '',
    season: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Redirect to home if not in development
  React.useEffect(() => {
    if (!import.meta.env.DEV) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // Don't render anything in production
  if (!import.meta.env.DEV) {
    return null;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    } else {
      toast({
        title: "Invalid file",
        description: "Please select an image file",
        variant: "destructive"
      });
    }
  };

  const getNextGalleryId = async (): Promise<number> => {
    // Fetch current gallery data to find highest ID
    try {
      const response = await fetch('/src/data/gallery.json');
      const galleryData = await response.json();
      const maxId = Math.max(...galleryData.map((photo: Photo) => photo.id));
      return maxId + 1;
    } catch (error) {
      console.error('Error reading gallery data:', error);
      // Fallback to timestamp-based ID if gallery.json can't be read
      return Date.now();
    }
  };

  const uploadToCloudinary = async (file: File, galleryId: number): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'memoir_gallery');
    formData.append('folder', 'memoir-gallery');
    formData.append('public_id', galleryId.toString()); // Use gallery ID as public_id for consistency

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dxmpicoqj/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error('Cloudinary upload failed');
    }

    const data = await response.json();
    return data.public_id.replace('memoir-gallery/', '');
  };

  const downloadImageLocally = async (file: File, filename: string) => {
    // Create a download link to save the file locally
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Local backup",
      description: `Please save the downloaded file to public/images/${filename}`,
    });
  };

  const downloadUpdatedGalleryJson = async (newPhoto: Photo) => {
    try {
      // Fetch current gallery data
      const response = await fetch('/src/data/gallery.json');
      const currentGallery = await response.json();
      
      // Add new photo to the beginning of the array (most recent first)
      const updatedGallery = [newPhoto, ...currentGallery];
      
      // Create downloadable JSON file
      const jsonBlob = new Blob([JSON.stringify(updatedGallery, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(jsonBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'gallery.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Gallery JSON Updated!",
        description: "Download complete. Replace src/data/gallery.json with the downloaded file to make the photo live.",
      });
    } catch (error) {
      console.error('Error updating gallery JSON:', error);
      toast({
        title: "JSON Update Failed",
        description: "Could not fetch current gallery data. Check console for details.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !formData.title || !formData.tag || !formData.season) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Get next available gallery ID
      const galleryId = await getNextGalleryId();
      
      // Upload to Cloudinary with consistent ID
      const cloudinaryFilename = await uploadToCloudinary(selectedFile, galleryId);
      
      // Generate filename for local storage (use gallery ID for consistency)
      const fileExtension = selectedFile.name.split('.').pop();
      const localFilename = `${galleryId}.${fileExtension}`;
      
      // Download for local backup
      await downloadImageLocally(selectedFile, localFilename);
      
      // Create new photo entry with consistent ID
      const newPhoto: Photo = {
        id: galleryId, // Use the same ID for perfect consistency
        title: formData.title,
        filename: `images/${localFilename}`,
        thumbnail: `images/${localFilename}`,
        date: new Date().toISOString().split('T')[0],
        tag: formData.tag,
        season: formData.season,
        caption: formData.caption || ''
      };

      // Download updated gallery.json with new photo added
      await downloadUpdatedGalleryJson(newPhoto);

      // Show success message
      toast({
        title: "Upload Complete!",
        description: `Photo ID ${galleryId} uploaded to Cloudinary and gallery.json updated. Replace the gallery.json file to make it live!`,
      });

      // Reset form
      setFormData({ title: '', caption: '', tag: '', season: '' });
      setSelectedFile(null);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your photo",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-cream via-foggy-blue/20 to-dusty-rose/20">
      <Header />
      <div className="max-w-2xl mx-auto p-8 pt-24">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Admin Upload (Development Only)
            </CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Upload new photos to the gallery. This page is only available in development.
            </p>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">How It Works:</h3>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. Upload automatically gets next available ID (currently 177+)</li>
                <li>2. Cloudinary gets public_id: memoir-gallery/{'{ID}'}</li>
                <li>3. Local backup filename: images/{'{ID}'}.jpg</li>
                <li>4. Updated gallery.json downloads automatically</li>
                <li>5. Replace src/data/gallery.json with downloaded file</li>
                <li>6. Photo appears immediately on the site!</li>
              </ol>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="file">Image File *</Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter photo title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="caption">Caption</Label>
                <Textarea
                  id="caption"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Enter photo caption"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="tag">Tag *</Label>
                <Select value={formData.tag} onValueChange={(value) => setFormData({ ...formData, tag: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time of day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="afternoon">Afternoon</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="season">Season *</Label>
                <Select value={formData.season} onValueChange={(value) => setFormData({ ...formData, season: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spring">Spring</SelectItem>
                    <SelectItem value="summer">Summer</SelectItem>
                    <SelectItem value="autumn">Autumn</SelectItem>
                    <SelectItem value="winter">Winter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Upload Photo'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
