gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

let mm = gsap.matchMedia();

gsap.to(".animate-text", {
  scrollTrigger: {
    trigger: ".animate-text",
    start: "top 85%", // Khi text vào 85% viewport thì chạy
    toggleActions: "play none none reverse"
  },
  opacity: 1,
  y: 0,
  duration: 1.5,
  ease: "power2.out"
});

gsap.to(".expertise-row > *:nth-child(2)", {
  scrollTrigger: {
    trigger: ".expertise-row > *:nth-child(2)",
    start: "top 85%",
    toggleActions: "play none none reverse"
  },
  opacity: 1,
  x: 0,
  duration: 1.5,
  ease: "power2.out"
});
gsap.to(".expertise-row > *:nth-child(3)", {
  scrollTrigger: {
    trigger: ".expertise-row > *:nth-child(3)",
    start: "top 85%",
    toggleActions: "play none none reverse"
  },
  opacity: 1,
  x: 0,
  duration: 1.5,
  ease: "power2.out"
});
gsap.to(".contacts",{
  scrollTrigger:{
    trigger:".contacts",
    start:"top 85%",
    toggleActions:"play none none reverse"
  },
  opacity:1,
  x:0,
  duration:1.5,
  ease:"power2.out"
})
// gsap.to(".career",{
//   scrollTrigger:{
//     trigger:".career",
//     start:"top 90%",
//     toggleActions:"play none none reverse",
//     markers: true, // Hiển thị điểm kích hoạt
//     onUpdate: (self) => console.log("Progress:", self.progress)
//   },
//   opacity:1,
//   x:0,
//   duration:1.5,
//   ease:"power2.out"
// })

mm.add("(min-width: 768px)", () => {
  // Animation dành cho Desktop
  gsap.to(".career",{
  scrollTrigger:{
    trigger:".career",
    toggleActions:"play none none reverse"
    // onUpdate: (self) => console.log("Progress:", self.progress)
  },
  opacity:1,
  x:0,
  duration:1.5,
  ease:"power2.out"
})
});

mm.add("(max-width: 767px)", () => {
  // Animation dành cho Mobile
  gsap.to(".career", { 
    scrollTrigger:{
      trigger:".career",
      toggleActions:"play none none reverse"
    },
    opacity:1,
    x:0,
    duration:1.5,
    ease:"power2.out"
  });
});

document.querySelector(".scrolldown").addEventListener("click", () => {
  gsap.to(window, {
    duration: 1,
    scrollTo: { y: "#aboutme", offsetY: 50 },
    ease: "power2.out"
  });
});

gsap.to("#canvas", {
  y: "+=300", // Canvas sẽ di chuyển xuống 300px khi cuộn
  ease: "none",
  scrollTrigger: {
      trigger: "#home",
      start: "top top",
      end: "bottom top",
      scrub: true
  }
});