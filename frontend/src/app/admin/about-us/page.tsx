"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save, Pencil, X, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AboutHero } from "@/app/(website)/about-us/components/about-hero";
import { OurStory } from "@/app/(website)/about-us/components/our-story";
import { Founder } from "@/app/(website)/about-us/components/founder";
import { OurMission } from "@/app/(website)/about-us/components/our-mission";
import { OurPurpose } from "@/app/(website)/about-us/components/our-purpose";
import { TrustCredentials } from "@/app/(website)/about-us/components/trust-credentials";
import { WhyBhutan } from "@/app/(website)/about-us/components/why-bhutan";
import { getAboutContentAction, updateAboutContentAction } from "./actions";
import { ImageUpload } from "@/components/admin/image-upload";
import { AboutContent } from "@/lib/data/about";

export default function AboutUsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form data state
  const [formData, setFormData] = useState<AboutContent>({
    hero: { title: "", subtitle: "", content: "", image: "" },
    story: { title: "", subtitle: "", content: "", image: "" },
    founder: { title: "", subtitle: "", name: "", role: "", nationality: "", experience: "", bio: "", image: "" },
    mission: { title: "", subtitle: "", image: "", items: [] },
    purpose: { title: "", subtitle: "", content: "", image: "" },
    credentials: { title: "", subtitle: "", licenseNumber: "", foundingYear: "", guideCredentials: "", emergencySupport: "", items: [] },
    whyBhutan: { title: "", subtitle: "", items: [] },
  });

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getAboutContentAction();
        setFormData(data);
      } catch (error) {
        toast.error("Failed to load content");
      } finally {
        setIsLoading(false);
      }
    };
    loadContent();
  }, []);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const formDataToSubmit = new FormData(event.currentTarget);

      // Add existing images as fallback (if not changed in ImageUpload)
      formDataToSubmit.append("existingHeroImage", formData.hero.image);
      formDataToSubmit.append("existingStoryImage", formData.story.image);
      formDataToSubmit.append("existingFounderImage", formData.founder.image);
      formDataToSubmit.append("existingPurposeImage", formData.purpose.image);

      const result = await updateAboutContentAction(formDataToSubmit);
      if (result.success) {
        toast.success(result.message);
        setIsEditMode(false);
        router.refresh();
        // Refresh local state
        const data = await getAboutContentAction();
        setFormData(data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // View Mode
  if (!isEditMode) {
    return (
      <div className="flex flex-col min-h-screen relative">
        <Button
          onClick={() => setIsEditMode(true)}
          className="fixed top-24 right-8 z-50 bg-amber-600 text-white hover:bg-amber-700 shadow-lg rounded-full w-12 h-12 p-0 flex items-center justify-center transition-transform hover:scale-110"
        >
          <Pencil className="w-5 h-5" />
        </Button>

        <AboutHero hero={{
          title: formData.hero.title.toUpperCase(),
          subtitle: formData.hero.subtitle,
          description: formData.hero.content,
          backgroundImage: formData.hero.image,
        }} />
        <OurStory story={{
          id: "our-story",
          title: formData.story.title,
          subtitle: formData.story.subtitle,
          content: formData.story.content.split("\n\n").filter(p => p.trim()),
          image: formData.story.image,
          order: 1,
        }} />
        <Founder founder={formData.founder} />
        <OurMission items={formData.mission.items} title={formData.mission.title} subtitle={formData.mission.subtitle} />
        <OurPurpose purpose={{
          id: "our-purpose",
          title: formData.purpose.title,
          subtitle: formData.purpose.subtitle,
          content: formData.purpose.content.split("\n\n").filter(p => p.trim()),
          image: formData.purpose.image,
          order: 2,
        }} />
        <TrustCredentials credentials={formData.credentials} />
        <WhyBhutan items={formData.whyBhutan.items} title={formData.whyBhutan.title} subtitle={formData.whyBhutan.subtitle} />
      </div>
    );
  }

  // Edit Mode
  return (
    <form onSubmit={handleSave} className="h-full max-w-7xl mx-auto w-full flex-1 flex-col space-y-6 flex md:p-8 pt-6">
      <input type="hidden" name="missionItems" value={JSON.stringify(formData.mission.items)} />
      <input type="hidden" name="trustItems" value={JSON.stringify(formData.credentials.items)} />
      <input type="hidden" name="whyBhutanItems" value={JSON.stringify(formData.whyBhutan.items)} />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-black">Edit About Us Content</h2>
          <p className="text-sm text-gray-600">Update the content for all about us sections</p>
        </div>
        <div className="flex gap-2 text-black">
          <Button type="button" variant="outline" onClick={() => setIsEditMode(false)} disabled={isSaving}>
            <X className="h-4 w-4" /> Cancel
          </Button>
          <Button className="bg-amber-600 hover:bg-amber-700" type="submit" disabled={isSaving}>
            {isSaving ?
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
              :
              <>Save Changes</>}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Hero Section */}
        <Card>
          <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hero-title">Title</Label>
                <Input id="hero-title" name="hero-title" value={formData.hero.title} onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, title: e.target.value } })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-subtitle">Subtitle</Label>
                <Input id="hero-subtitle" name="hero-subtitle" value={formData.hero.subtitle} onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, subtitle: e.target.value } })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-content">Description</Label>
              <Textarea id="hero-content" name="hero-content" value={formData.hero.content} onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, content: e.target.value } })} className="min-h-[100px]" />
            </div>
            <ImageUpload name="heroImage" label="Background Image" defaultPreview={formData.hero.image} />
          </CardContent>
        </Card>

        {/* Our Story */}
        <Card>
          <CardHeader><CardTitle>Our Story</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="story-title">Title</Label>
                <Input id="story-title" name="story-title" value={formData.story.title} onChange={(e) => setFormData({ ...formData, story: { ...formData.story, title: e.target.value } })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="story-subtitle">Subtitle</Label>
                <Input id="story-subtitle" name="story-subtitle" value={formData.story.subtitle} onChange={(e) => setFormData({ ...formData, story: { ...formData.story, subtitle: e.target.value } })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="story-content">Narrative Content</Label>
              <Textarea id="story-content" name="story-content" value={formData.story.content} onChange={(e) => setFormData({ ...formData, story: { ...formData.story, content: e.target.value } })} className="min-h-[150px]" />
            </div>
            <ImageUpload name="storyImage" label="Sidebar Image" defaultPreview={formData.story.image} />
          </CardContent>
        </Card>

        {/* Founder */}
        <Card>
          <CardHeader>
            <CardTitle>Founder</CardTitle>
            <p className="text-sm text-gray-500">
              Who founded the company, their background, and why travelers should trust them. Leave a field blank to hide it on the public page.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="founder-title">Section Title</Label>
                <Input id="founder-title" name="founder-title" value={formData.founder.title} onChange={(e) => setFormData({ ...formData, founder: { ...formData.founder, title: e.target.value } })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="founder-subtitle">Subtitle Label</Label>
                <Input id="founder-subtitle" name="founder-subtitle" value={formData.founder.subtitle} onChange={(e) => setFormData({ ...formData, founder: { ...formData.founder, subtitle: e.target.value } })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="founder-name">Founder Name</Label>
                <Input id="founder-name" name="founder-name" placeholder="e.g. Ms. Lhamchu Delma" value={formData.founder.name} onChange={(e) => setFormData({ ...formData, founder: { ...formData.founder, name: e.target.value } })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="founder-role">Role / Title</Label>
                <Input id="founder-role" name="founder-role" placeholder="e.g. Founder & Managing Director" value={formData.founder.role} onChange={(e) => setFormData({ ...formData, founder: { ...formData.founder, role: e.target.value } })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="founder-nationality">Nationality</Label>
                <Input id="founder-nationality" name="founder-nationality" placeholder="e.g. Bhutanese" value={formData.founder.nationality} onChange={(e) => setFormData({ ...formData, founder: { ...formData.founder, nationality: e.target.value } })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="founder-experience">Years of Experience</Label>
                <Input id="founder-experience" name="founder-experience" placeholder="e.g. 14 years" value={formData.founder.experience} onChange={(e) => setFormData({ ...formData, founder: { ...formData.founder, experience: e.target.value } })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="founder-bio">Founder Bio</Label>
              <Textarea id="founder-bio" name="founder-bio" value={formData.founder.bio} onChange={(e) => setFormData({ ...formData, founder: { ...formData.founder, bio: e.target.value } })} className="min-h-[120px]" />
            </div>
            <ImageUpload name="founderImage" label="Founder Portrait" defaultPreview={formData.founder.image} />
          </CardContent>
        </Card>

        {/* Our Mission */}
        <Card>
          <CardHeader><CardTitle>Our Mission</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mission-title">Section Title</Label>
                <Input id="mission-title" name="mission-title" value={formData.mission.title} onChange={(e) => setFormData({ ...formData, mission: { ...formData.mission, title: e.target.value } })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mission-subtitle">Subtitle Label</Label>
                <Input id="mission-subtitle" name="mission-subtitle" value={formData.mission.subtitle} onChange={(e) => setFormData({ ...formData, mission: { ...formData.mission, subtitle: e.target.value } })} />
              </div>
            </div>
            <div className="space-y-4 mt-4">
              <Label>Mission Items</Label>
              {formData.mission.items.map((item, index) => (
                <div key={item.id} className="p-4 border space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-gray-400">ITEM #{index + 1}</span>
                    <Button type="button" variant="outline" size="icon" className="text-red-500 hover:text-red-700 h-8" onClick={() => {
                      const newItems = formData.mission.items.filter((_, i) => i !== index);
                      setFormData({ ...formData, mission: { ...formData.mission, items: newItems } });
                    }}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                  <Input placeholder="Item Title" value={item.title} onChange={(e) => {
                    const newItems = [...formData.mission.items];
                    newItems[index].title = e.target.value;
                    setFormData({ ...formData, mission: { ...formData.mission, items: newItems } });
                  }} />
                  <Textarea placeholder="Item Description" value={item.description} onChange={(e) => {
                    const newItems = [...formData.mission.items];
                    newItems[index].description = e.target.value;
                    setFormData({ ...formData, mission: { ...formData.mission, items: newItems } });
                  }} />
                </div>
              ))}
              <Button type="button" size="icon" className="w-full" onClick={() => {
                const newItems = [...formData.mission.items, { id: `mission-${Date.now()}`, title: "New Mission Item", description: "", order: formData.mission.items.length + 1 }];
                setFormData({ ...formData, mission: { ...formData.mission, items: newItems } });
              }}><Plus className="w-4 h-4" />Add Item</Button>
            </div>
          </CardContent>
        </Card>

        {/* Our Purpose */}
        <Card>
          <CardHeader><CardTitle>Our Purpose</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purpose-title">Title</Label>
                <Input id="purpose-title" name="purpose-title" value={formData.purpose.title} onChange={(e) => setFormData({ ...formData, purpose: { ...formData.purpose, title: e.target.value } })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purpose-subtitle">Subtitle</Label>
                <Input id="purpose-subtitle" name="purpose-subtitle" value={formData.purpose.subtitle} onChange={(e) => setFormData({ ...formData, purpose: { ...formData.purpose, subtitle: e.target.value } })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose-content">Purpose Statement</Label>
              <Textarea id="purpose-content" name="purpose-content" value={formData.purpose.content} onChange={(e) => setFormData({ ...formData, purpose: { ...formData.purpose, content: e.target.value } })} className="min-h-[150px]" />
            </div>
            <ImageUpload name="purposeImage" label="Purpose Image" defaultPreview={formData.purpose.image} />
          </CardContent>
        </Card>

        {/* Credentials & Trust */}
        <Card>
          <CardHeader>
            <CardTitle>Credentials & Trust</CardTitle>
            <p className="text-sm text-gray-500">
              License number, founding year, guide credentials, and emergency support. Only enter real, verifiable details — leave a field blank rather than guess; it simply won&apos;t show on the public page.
              Office address and phone are managed under Contact settings.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="credentials-title">Section Title</Label>
                <Input id="credentials-title" name="credentials-title" value={formData.credentials.title} onChange={(e) => setFormData({ ...formData, credentials: { ...formData.credentials, title: e.target.value } })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credentials-subtitle">Subtitle Label</Label>
                <Input id="credentials-subtitle" name="credentials-subtitle" value={formData.credentials.subtitle} onChange={(e) => setFormData({ ...formData, credentials: { ...formData.credentials, subtitle: e.target.value } })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="credentials-license">Tour Operator License Number</Label>
                <Input id="credentials-license" name="credentials-license" placeholder="e.g. TCB/L-1234" value={formData.credentials.licenseNumber} onChange={(e) => setFormData({ ...formData, credentials: { ...formData.credentials, licenseNumber: e.target.value } })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credentials-founding-year">Founding Year</Label>
                <Input id="credentials-founding-year" name="credentials-founding-year" placeholder="e.g. 2015" value={formData.credentials.foundingYear} onChange={(e) => setFormData({ ...formData, credentials: { ...formData.credentials, foundingYear: e.target.value } })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="credentials-guides">Guide Credentials</Label>
              <Textarea id="credentials-guides" name="credentials-guides" placeholder="e.g. All guides are licensed by the Tourism Council of Bhutan and trained in first aid" value={formData.credentials.guideCredentials} onChange={(e) => setFormData({ ...formData, credentials: { ...formData.credentials, guideCredentials: e.target.value } })} className="min-h-[80px]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credentials-emergency">Emergency Support</Label>
              <Textarea id="credentials-emergency" name="credentials-emergency" placeholder="e.g. 24/7 emergency line for travelers on-trip: +975-XX-XXXXXX" value={formData.credentials.emergencySupport} onChange={(e) => setFormData({ ...formData, credentials: { ...formData.credentials, emergencySupport: e.target.value } })} className="min-h-[80px]" />
            </div>

            <div className="space-y-4 mt-4">
              <Label>Additional Trust Badges (optional)</Label>
              {formData.credentials.items.map((item, index) => (
                <div key={item.id} className="p-4 border space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-gray-400">ITEM #{index + 1}</span>
                    <Button type="button" variant="outline" size="icon" className="text-red-500 hover:text-red-700 h-8" onClick={() => {
                      const newItems = formData.credentials.items.filter((_, i) => i !== index);
                      setFormData({ ...formData, credentials: { ...formData.credentials, items: newItems } });
                    }}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                  <Input placeholder="Item Title" value={item.title} onChange={(e) => {
                    const newItems = [...formData.credentials.items];
                    newItems[index].title = e.target.value;
                    setFormData({ ...formData, credentials: { ...formData.credentials, items: newItems } });
                  }} />
                  <Textarea placeholder="Item Description" value={item.description} onChange={(e) => {
                    const newItems = [...formData.credentials.items];
                    newItems[index].description = e.target.value;
                    setFormData({ ...formData, credentials: { ...formData.credentials, items: newItems } });
                  }} />
                </div>
              ))}
              <Button type="button" size="icon" className="w-full" onClick={() => {
                const newItems = [...formData.credentials.items, { id: `trust-${Date.now()}`, title: "New Trust Badge", description: "", order: formData.credentials.items.length + 1 }];
                setFormData({ ...formData, credentials: { ...formData.credentials, items: newItems } });
              }}><Plus className="w-4 h-4" />Add Item</Button>
            </div>
          </CardContent>
        </Card>

        {/* Why Bhutan */}
        <Card>
          <CardHeader>
            <CardTitle>Why Bhutan</CardTitle>
            <p className="text-sm text-gray-500">
              The closing section of the page — facts about the Kingdom itself, not your company.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="whybhutan-title">Section Title</Label>
                <Input id="whybhutan-title" name="whybhutan-title" value={formData.whyBhutan.title} onChange={(e) => setFormData({ ...formData, whyBhutan: { ...formData.whyBhutan, title: e.target.value } })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whybhutan-subtitle">Subtitle Label</Label>
                <Input id="whybhutan-subtitle" name="whybhutan-subtitle" value={formData.whyBhutan.subtitle} onChange={(e) => setFormData({ ...formData, whyBhutan: { ...formData.whyBhutan, subtitle: e.target.value } })} />
              </div>
            </div>
            <div className="space-y-4 mt-4">
              <Label>Identifier Items</Label>
              {formData.whyBhutan.items.map((item, index) => (
                <div key={item.id} className="p-4 border space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-gray-400">ITEM #{index + 1}</span>
                    <Button type="button" variant="outline" size="icon" className="text-red-500 hover:text-red-700 h-8" onClick={() => {
                      const newItems = formData.whyBhutan.items.filter((_, i) => i !== index);
                      setFormData({ ...formData, whyBhutan: { ...formData.whyBhutan, items: newItems } });
                    }}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                  <Input placeholder="Item Title" value={item.title} onChange={(e) => {
                    const newItems = [...formData.whyBhutan.items];
                    newItems[index].title = e.target.value;
                    setFormData({ ...formData, whyBhutan: { ...formData.whyBhutan, items: newItems } });
                  }} />
                  <Textarea placeholder="Item Description" value={item.description} onChange={(e) => {
                    const newItems = [...formData.whyBhutan.items];
                    newItems[index].description = e.target.value;
                    setFormData({ ...formData, whyBhutan: { ...formData.whyBhutan, items: newItems } });
                  }} />
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <Select
                      value={item.icon}
                      onValueChange={(value) => {
                        const newItems = [...formData.whyBhutan.items];
                        newItems[index].icon = value;
                        setFormData({ ...formData, whyBhutan: { ...formData.whyBhutan, items: newItems } });
                      }}
                    >
                      <SelectTrigger className="bg-white border-gray-200 text-black w-full">
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {WHY_BHUTAN_ICON_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
              <Button type="button" size="icon" className="w-full" onClick={() => {
                const newItems = [...formData.whyBhutan.items, { id: `whybhutan-${Date.now()}`, title: "New Identifier", description: "", icon: "smile", order: formData.whyBhutan.items.length + 1 }];
                setFormData({ ...formData, whyBhutan: { ...formData.whyBhutan, items: newItems } });
              }}><Plus className="w-4 h-4" />Add Item</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}

const WHY_BHUTAN_ICON_OPTIONS = [
  { value: "smile", label: "Smile" },
  { value: "mountain", label: "Mountain" },
  { value: "heart", label: "Heart" },
  { value: "sparkles", label: "Sparkles" },
  { value: "leaf", label: "Leaf" },
  { value: "key", label: "Key" },
];
