export interface VideoTestimonial {
  id: number;
  video: string;
  name: string;
  country: string;
  caption: string;
  variant: string;
}

export const VIDEO_TESTIMONIALS = [
  {
  id: 1,
  video: "https://ossireliva-media.s3.us-east-2.amazonaws.com/ossireliva-media/Ossireliva1.mp4", 
  name: "Aimi S.",
  country: "Japan",
  variant: "Lemongrass",
  caption: "Simple, calming, and non-greasy",
  },
  {
  id: 2,
  video: "https://ossireliva-media.s3.us-east-2.amazonaws.com/ossireliva-media/Ossileriva_Testimonial_7.mp4",
  name: "Siriporn S.",
  country: "Thailand",
  variant: "Cedarwood",
  caption: "Soothing and light—perfect for humid nights.",
  },
  {
  id: 3,
  video: "https://ossireliva-media.s3.us-east-2.amazonaws.com/ossireliva-media/Ossileriva_Testimonial_6.mp4",
  name: "Leilani M.",
  country: "Global Citizen",
  variant: "Lemongrass",
  caption: "The perfect addition to my evening ritual. So calming!",
  },
  {
    id: 4,
    video: "https://ossireliva-media.s3.us-east-2.amazonaws.com/ossireliva-media/Ossileriva_Testimonial_8.mp4",
    name: "Julian R.",
    country: "United States",
    variant: "Cedarwood",
    caption: "The Cedarwood scent is incredible—manly but very relaxing.",
  },
  {
    id: 5,
    video: "https://ossireliva-media.s3.us-east-2.amazonaws.com/ossireliva-media/Ossileriva_Testimonial_11.mp4",
    name: "Priya S.",
    country: "United States",
    variant: "Cedarwood", 
    caption: "The perfect glow for my daily ritual. Absolutely obsessed!",
  },
  {
    id: 6,
    video: "https://ossireliva-media.s3.us-east-2.amazonaws.com/ossireliva-media/Ossileriva_Testimonial_9.mp4",
    name: "Amara K.",
    country: "Nigeria", // Or "South Africa", "Ghana", etc.
    variant: "Cedarwood", 
    caption: "Finally, a ritual that feels luxurious but isn't heavy on the skin.",
  },
  {
    id: 7,
    video:
      "https://ossireliva-media.s3.us-east-2.amazonaws.com/ossireliva-media/Ossileriva_Testimonial_2.mp4",
    name: "Anna K",
    country: "Kenya",
    variant: "Cedarwood",
    caption: "Part of my evening routine now",
  },
  {
    id: 8,
    video:
      "https://ossireliva-media.s3.us-east-2.amazonaws.com/ossireliva-media/Ossileriva_Testimonial_3.mp4",
    name: "Prianna A",
    country: "United States",
    variant: "Cedarwood",
    caption: "Simple, calming, and non-greasy",
  },
  {
    id: 9,
    video:
      "https://ossireliva-media.s3.us-east-2.amazonaws.com/ossireliva-media/Ossileriva_Testimonial_4.mp4",
    name: "Prianna A",
    country: "United States",
    variant: "Cedarwood",
    caption: "Simple, calming, and non-greasy",
  },
  {
    id: 10,
    video:
      "https://ossireliva-media.s3.us-east-2.amazonaws.com/ossireliva-media/Ossileriva_Testimonial_10.mp4",
    name: "Prianna A",
    country: "United States",
    variant: "Cedarwood",
    caption: "Simple, calming, and non-greasy",
  },  
];
