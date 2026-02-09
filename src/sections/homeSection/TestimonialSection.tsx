import { PlayCircle, PauseCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { VIDEO_TESTIMONIALS } from "../../data/testimonials";

export const TestimonialSection = () => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  /* ---------------- Video control ---------------- */
  const togglePlay = (index: number) => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;

      if (i === index) {
        if (video.paused) {
          video.currentTime = 0;
          video.muted = false;
          video.play();
          setPlayingIndex(index);

          setTimeout(() => {
            video.muted = true;
          }, 2000);
        } else {
          video.pause();
          setPlayingIndex(null);
        }
      } else {
        video.pause();
      }
    });
  };


  /* ---------------- Carousel movement ---------------- */
  const scrollByCard = (direction: "left" | "right") => {
    if (!trackRef.current) return;

    const cardWidth = trackRef.current.firstElementChild?.clientWidth || 300;
    const gap = 24; // matches gap-6
    const scrollAmount = cardWidth + gap;

    trackRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  /* ---------------- Auto slide ---------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      scrollByCard("right");
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-32 bg-black overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[420px] h-[420px] bg-brand/10 blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[380px] h-[380px] bg-brand-soft/10 blur-[140px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-16"
        >
          <p className="text-brand text-sm uppercase tracking-wide mb-4">
            Real Experiences
          </p>

          <h2 className="font-heading text-4xl md:text-5xl text-white leading-tight mb-6">
            Loved by
            <br />
            thoughtful people
          </h2>

          <p className="text-white/70 text-lg leading-relaxed">
            Ossireliva blends quietly fit into real lives — across cultures,
            routines, and moments of stillness.
          </p>
        </motion.div>

        {/* Controls */}
        <div className="flex justify-end gap-3 mb-6">
          <button
            onClick={() => scrollByCard("left")}
            className="p-3 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/40 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollByCard("right")}
            className="p-3 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/40 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Carousel */}
        <div
          ref={trackRef}
          className="
            flex gap-6 overflow-hidden
            scroll-smooth
          "
        >
          {VIDEO_TESTIMONIALS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="
                min-w-[85%]
                sm:min-w-[60%]
                lg:min-w-[40%]
                xl:min-w-[32%]
                rounded-2xl
                border border-white/10
                bg-white/5
                overflow-hidden
              "
            >
              {/* Video */}
              <div
                className="relative h-52 md:h-60 cursor-pointer"
                onClick={() => togglePlay(index)}
              >
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
                    <PauseCircle className="w-14 h-14 text-white/90" />
                  ) : (
                    <PlayCircle className="w-14 h-14 text-white/90" />
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-white font-medium text-sm">
                    {item.name}{" "}
                    <span className="text-white/50">— {item.country}</span>
                  </p>
                  <p className="text-white/60 text-xs mt-1">
                    {item.caption}
                  </p>
                </div>

                <span className="text-xs text-brand">
                  {item.variant}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
