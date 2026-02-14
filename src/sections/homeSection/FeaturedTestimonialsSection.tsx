import { PlayCircle, PauseCircle } from "lucide-react";
import { useRef, useState } from "react";
import { motion } from "motion/react";
import { VIDEO_TESTIMONIALS } from "../../data/testimonials";

export const FeaturedTestimonialsSection = () => {
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const featured = VIDEO_TESTIMONIALS.slice(0, 2);

  const togglePlay = (index: number) => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;

      if (i === index) {
        if (video.paused) {
          // 1. Force the video to be unmuted before playing
          video.muted = false; 
          video.play();
          setPlayingIndex(index);
        } else {
          video.pause();
          setPlayingIndex(null);
        }
      } else {
        // 2. Pause other videos if they were playing
        video.pause();
      }
    });
  };

  return (
    <section className="relative py-32 bg-black overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-brand/10 blur-[140px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-soft/10 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-5 md:px-10 grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT COPY */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <p className="text-brand text-sm uppercase tracking-wide">
            A shared experience
          </p>

          <h2 className="font-heading text-4xl md:text-5xl text-white leading-tight">
            A quiet ritual,
            <br />
            felt across the world
          </h2>

          <p className="text-white/70 text-lg max-w-xl">
            Ossireliva is not loud. It’s the pause after a long day —
            a moment people return to, morning or night.
          </p>

          <p className="text-white font-medium">
            These are their moments.
          </p>
        </motion.div>

        {/* RIGHT VIDEOS */}
        <div className="grid sm:grid-cols-2 gap-6">
          {featured.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl overflow-hidden bg-white/5 border border-white/10"
            >
              <div
                className="relative h-52 cursor-pointer"
                onClick={() => togglePlay(index)}
              >
                {/* <video
                  ref={(el) => {
                    if (el) videoRefs.current[index] = el;
                  }}
                  src={item.video}
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                /> */}

                <video
                  ref={(el) => {
                    if (el) videoRefs.current[index] = el;
                  }}
                  src={item.video}
                  muted 
                  playsInline
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  {playingIndex === index ? (
                    <PauseCircle className="w-12 h-12 text-white/90" />
                  ) : (
                    <PlayCircle className="w-12 h-12 text-white/90" />
                  )}
                </div>
              </div>

              <div className="p-4">
                <p className="text-white text-sm font-medium">
                  {item.name}
                  <span className="text-white/60"> — {item.country}</span>
                </p>
                <p className="text-white/50 text-xs mt-1">
                  {item.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
