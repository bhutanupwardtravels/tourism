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
import { AboutHero } from "@/app/(website)/about-us/components/about-hero";
import { OurStory } from "@/app/(website)/about-us/components/our-story";
import { OurMission } from "@/app/(website)/about-us/components/our-mission";
import { OurPurpose } from "@/app/(website)/about-us/components/our-purpose";
import { SustainableTravel } from "@/app/(website)/about-us/components/sustainable-travel";
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
    mission: { title: "", subtitle: "", image: "", items: [] },
    purpose: { title: "", subtitle: "", content: "", image: "" },
    sustainable: { title: "", subtitle: "", intro: "", image: "", items: [] },
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
      formDataToSubmit.append("existingPurposeImage", formData.purpose.image);
      formDataToSubmit.append("existingSustainableImage", formData.sustainable.image);

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
        <OurMission items={formData.mission.items} subtitle={formData.mission.subtitle} />
        <OurPurpose purpose={{
          id: "our-purpose",
          title: formData.purpose.title,
          subtitle: formData.purpose.subtitle,
          content: formData.purpose.content.split("\n\n").filter(p => p.trim()),
          image: formData.purpose.image,
          order: 2,
        }} />
        <SustainableTravel
          items={formData.sustainable.items}
          intro={formData.sustainable.intro}
          subtitle={formData.sustainable.subtitle}
        />
        <WhyBhutan items={[
          {
            id: "gross-national-happiness",
            title: "Gross National Happiness",
            icon: "smile",
            description: "Bhutan measures progress through Gross National Happiness rather than GDP, prioritizing the wellbeing of its people and environment over economic growth alone.",
            order: 1
          },
          {
            id: "pristine-nature",
            title: "Pristine Nature",
            icon: "mountain",
            description: "With 72% forest coverage and a constitutional mandate to maintain at least 60% of the land under forest cover, Bhutan offers some of the world's most pristine landscapes.",
            order: 2
          },
          {
            id: "living-culture",
            title: "Living Culture",
            icon: "heart",
            description: "In Bhutan, culture isn't preserved in museums—it's alive in daily life. From traditional dress to ancient festivals, Bhutanese culture thrives in the modern world.",
            order: 3
          },
          {
            id: "spiritual-heritage",
            title: "Spiritual Heritage",
            icon: "sparkles",
            description: "Buddhism permeates every aspect of Bhutanese life, offering travelers a chance to explore profound spiritual traditions and practices in their authentic context.",
            order: 4
          },
          {
            id: "sustainable-development",
            title: "Sustainable Development",
            icon: "leaf",
            description: "Bhutan's approach to development balances modernization with tradition, proving that progress and preservation can coexist harmoniously.",
            order: 5
          },
          {
            id: "exclusive-access",
            title: "Exclusive Access",
            icon: "key",
            description: "Bhutan's high-value tourism policy means fewer crowds and more meaningful interactions, offering an exclusive and intimate travel experience.",
            order: 6
          }
        ]} />
      </div>
    );
  }

  // Edit Mode
  return (
    <form onSubmit={handleSave} className="h-full max-w-7xl mx-auto w-full flex-1 flex-col space-y-6 flex md:p-8 pt-6">
      <input type="hidden" name="missionItems" value={JSON.stringify(formData.mission.items)} />
      <input type="hidden" name="sustainableItems" value={JSON.stringify(formData.sustainable.items)} />

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

        {/* Sustainable Travel */}
        <Card>
          <CardHeader><CardTitle>Sustainable Travel</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sustainable-title">Title</Label>
                <Input id="sustainable-title" name="sustainable-title" value={formData.sustainable.title} onChange={(e) => setFormData({ ...formData, sustainable: { ...formData.sustainable, title: e.target.value } })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sustainable-subtitle">Subtitle</Label>
                <Input id="sustainable-subtitle" name="sustainable-subtitle" value={formData.sustainable.subtitle} onChange={(e) => setFormData({ ...formData, sustainable: { ...formData.sustainable, subtitle: e.target.value } })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sustainable-intro">Intro Text</Label>
              <Textarea id="sustainable-intro" name="sustainable-intro" value={formData.sustainable.intro} onChange={(e) => setFormData({ ...formData, sustainable: { ...formData.sustainable, intro: e.target.value } })} className="min-h-[100px]" />
            </div>

            <div className="space-y-4 mt-4">
              <Label>Sustainability Items</Label>
              {formData.sustainable.items.map((item, index) => (
                <div key={item.id} className="p-4 border space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-gray-400">ITEM #{index + 1}</span>
                    <Button type="button" variant="outline" size="icon" className="text-red-500 hover:text-red-700 h-8" onClick={() => {
                      const newItems = formData.sustainable.items.filter((_, i) => i !== index);
                      setFormData({ ...formData, sustainable: { ...formData.sustainable, items: newItems } });
                    }}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                  <Input placeholder="Item Title" value={item.title} onChange={(e) => {
                    const newItems = [...formData.sustainable.items];
                    newItems[index].title = e.target.value;
                    setFormData({ ...formData, sustainable: { ...formData.sustainable, items: newItems } });
                  }} />
                  <Textarea placeholder="Item Description" value={item.description} onChange={(e) => {
                    const newItems = [...formData.sustainable.items];
                    newItems[index].description = e.target.value;
                    setFormData({ ...formData, sustainable: { ...formData.sustainable, items: newItems } });
                  }} />
                </div>
              ))}
              <Button type="button" size="icon" className="w-full" onClick={() => {
                const newItems = [...formData.sustainable.items, { id: `sust-${Date.now()}`, title: "New Sustainability Item", description: "", order: formData.sustainable.items.length + 1 }];
                setFormData({ ...formData, sustainable: { ...formData.sustainable, items: newItems } });
              }}><Plus className="w-4 h-4" />Add Item</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
