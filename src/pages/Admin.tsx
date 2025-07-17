
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

  const generateUniqueId = () => {
    return Date.now() + Math.random();
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'memoir_gallery');
    formData.append('folder', 'memoir-gallery');

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

  const addToGallery = async (newPhoto: Photo) => {
    // In a real app, this would update the gallery.json file
    // For now, we'll just show the JSON that should be added
    console.log('New photo entry:', JSON.stringify(newPhoto, null, 2));
    
    toast({
      title: "Photo uploaded successfully!",
      description: "Check console for gallery entry JSON to add to gallery.json",
    });
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
      // Upload to Cloudinary
      const cloudinaryFilename = await uploadToCloudinary(selectedFile);
      
      // Generate filename for local storage
      const fileExtension = selectedFile.name.split('.').pop();
      const localFilename = `${cloudinaryFilename}.${fileExtension}`;
      
      // Download for local backup
      await downloadImageLocally(selectedFile, localFilename);
      
      // Create new photo entry
      const newPhoto: Photo = {
        id: generateUniqueId(),
        title: formData.title,
        filename: `images/${localFilename}`,
        thumbnail: `images/${localFilename}`,
        date: new Date().toISOString().split('T')[0],
        tag: formData.tag,
        season: formData.season,
        caption: formData.caption || ''
      };

      // Add to gallery (in development, this logs the JSON)
      await addToGallery(newPhoto);

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
    <div className="min-h-screen bg-gradient-to-br from-warm-cream via-foggy-blue/20 to-dusty-rose/20 p-8">
      <div className="max-w-2xl mx-auto">
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
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h3 className="font-semibold text-amber-800 mb-2">Setup Instructions:</h3>
              <ol className="text-sm text-amber-700 space-y-1">
                <li>1. Create upload preset "memoir_gallery" in Cloudinary (unsigned)</li>
                <li>2. Set folder to "memoir-gallery" in the preset</li>
                <li>3. Enable automatic format and quality optimization</li>
                <li>4. After upload, manually save the downloaded file to public/images/</li>
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
