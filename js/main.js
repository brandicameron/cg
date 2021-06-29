gsap.registerPlugin(ScrollTrigger, CustomEase, CustomWiggle);

// ---------------- INTRO SCREEN/ANIMATION ----------------
// Added body hidden code to prevent the flash whichever screen isn't supposed to show based on session storage value
function determineSessionStorage() {
  if (!("visited" in sessionStorage)) {
    introAnimation();
    document.querySelector("body").hidden = false;
  } else {
    document.querySelector(".intro").hidden = true;
    document.querySelector("body").hidden = false;
  }
  sessionStorage.setItem("visited", "visited");
}

function introAnimation() {
  function raiseIntro() {
    document.querySelector(".intro").classList.add("raise-intro");
  }

  let tl = gsap.timeline();
  CustomWiggle.create("myWiggle", { wiggles: 4 });

  tl.to(".hand", {
    delay: 1.2,
    duration: 0.4,
    y: 400,
  })
    .to(".stain", {
      opacity: 0,
      duration: 0.2,
    })
    .to(".hand", {
      duration: 0.3,
      ease: "myWiggle",
      x: 5,
    })
    .to(".hand", {
      duration: 1,
      y: -400,
      // onUpdate: raiseIntro,
      onComplete: raiseIntro,
    });
}

window.onload = determineSessionStorage;

// ---------------- BUBBLES ----------------
//https://codepen.io/snorkltv/pen/abddMGd

function init() {
  let width = window.innerWidth;
  let height = window.scrollY + window.innerHeight;
  let master = gsap.timeline();

  CustomWiggle.create("large", {
    wiggles: 4, //number of wiggles/oscilations
    type: "easeInOut",
  });

  CustomWiggle.create("medium", {
    wiggles: 4, //number of wiggles/oscilations
    type: "easeInOut",
  });

  CustomWiggle.create("small", {
    wiggles: 10, //number of wiggles/oscilations
    type: "easeInOut",
  });

  let small = {
    ease: "small",
    duration: 8,
    min: 0.3,
    max: 0.4,
    scaleEase: "none",
  };

  let medium = {
    ease: "medium",
    duration: 12,
    min: 0.4,
    max: 0.6,
    scaleEase: "power2.in",
  };

  let large = {
    ease: "large",
    duration: 15,
    min: 0.7,
    max: 1,
    scaleEase: "power4.in",
  };

  let configs = [small, medium, large];

  function weightedRandom(collection, ease) {
    return gsap.utils.pipe(
      Math.random, //random number between 0 and 1
      gsap.parseEase(ease), //apply the ease
      gsap.utils.mapRange(0, 1, -0.5, collection.length - 0.5), //map to the index range of the array, stretched by 0.5 each direction because we'll round and want to keep distribution (otherwise linear distribution would be center-weighted slightly)
      gsap.utils.snap(1), //snap to the closest integer
      (i) => collection[i] //return that element from the array
    );
  }

  // usage:
  let getRandomConfig = weightedRandom(configs, "power4.in");

  function createBubbles(amount) {
    for (let i = 0; i < amount; i++) {
      let bubble = document.createElement("div");

      let bubbleType = getRandomConfig();
      let scale = gsap.utils.random(bubbleType.min, bubbleType.max);
      let ease = bubbleType.ease;
      let scaleEase = bubbleType.scaleEase;
      let duration = bubbleType.duration;
      let tl = gsap.timeline({ repeat: -1, repeatDelay: Math.random() * 3 });
      let relativeDirection = Math.random() < 0.5 ? "+=" : "-=";

      bubble.setAttribute("class", "bubble");
      let bubbleContainer = document.querySelector(".bubbles");
      bubbleContainer.appendChild(bubble);
      tl.set(bubble, {
        x: gsap.utils.random(0, width),
        y: height + 100 * scale,
        xPercent: -50,
        yPercent: -50,
        scale: 0,
      });

      tl.to(bubble, { y: -200, duration: duration, ease: "power1.in" });
      tl.to(
        bubble,
        { duration: 1, scale: scale, ease: scaleEase },
        gsap.utils.random(0, 0.5)
      );
      tl.to(
        bubble,
        {
          x: relativeDirection + scale * 80,
          ease: ease,
          duration: duration * 2,
        },
        gsap.utils.random(0.3, 1.5)
      );

      master.add(tl, i * 0.1);
    }
    master.timeScale(600 / height);
    master.time(100000);
  }

  createBubbles(5);
  gsap.to("body", { opacity: 1, duration: 0.2 });
}
gsap.delayedCall(0.1, init);

// ---------------- CONTENT ANIMATIONS ----------------

gsap.to(".header-video", {
  scale: 1.3,
  scrollTrigger: {
    trigger: ".header-video",
    start: "top",
    end: "+=900",
    scrub: true,
  },
});

// const packages = gsap.utils.toArray(".package-card");

// ---------------- INSERT COPYRIGHT ----------------

const currentYear = new Date().getFullYear();
document.getElementById(
  "copyright-year"
).textContent = `© Clean & Green, LLC \u00A0 2008 — ${currentYear} \u00A0 |\u00A0 \u00A0 All Rights Reserved`;
