import { motion } from "framer-motion";

const orbs = [
  { size: 400, color: "hsl(263 70% 40%)", x: "10%", y: "20%", duration: 20 },
  { size: 300, color: "hsl(185 60% 30%)", x: "70%", y: "60%", duration: 25 },
  { size: 250, color: "hsl(330 60% 35%)", x: "80%", y: "10%", duration: 18 },
  { size: 350, color: "hsl(263 50% 25%)", x: "30%", y: "70%", duration: 22 },
];

export default function FloatingOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="floating-orb"
          style={{
            width: orb.size,
            height: orb.size,
            background: orb.color,
            left: orb.x,
            top: orb.y,
          }}
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.1, 0.9, 1],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
