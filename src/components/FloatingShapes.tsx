export const FloatingShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      {/* Circle 1 - Indigo */}
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 animate-float-slow"
        style={{
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.4), transparent)",
          top: "10%",
          left: "5%",
          animationDelay: "0s",
          animationDuration: "20s",
        }}
      />
      
      {/* Circle 2 - Purple */}
      <div
        className="absolute w-80 h-80 rounded-full blur-3xl opacity-20 animate-float-slow"
        style={{
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.4), transparent)",
          top: "60%",
          right: "10%",
          animationDelay: "3s",
          animationDuration: "25s",
        }}
      />
      
      {/* Circle 3 - Pink */}
      <div
        className="absolute w-72 h-72 rounded-full blur-3xl opacity-20 animate-float-slow"
        style={{
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.4), transparent)",
          bottom: "15%",
          left: "15%",
          animationDelay: "5s",
          animationDuration: "22s",
        }}
      />
      
      {/* Triangle 1 */}
      <div
        className="absolute w-64 h-64 blur-2xl opacity-10 animate-spin-slow"
        style={{
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.3), transparent)",
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          top: "30%",
          right: "20%",
          animationDuration: "30s",
        }}
      />
      
      {/* Triangle 2 */}
      <div
        className="absolute w-56 h-56 blur-2xl opacity-10 animate-spin-slow"
        style={{
          background: "linear-gradient(135deg, rgba(168, 85, 247, 0.3), transparent)",
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          bottom: "25%",
          right: "35%",
          animationDelay: "4s",
          animationDuration: "35s",
        }}
      />
    </div>
  );
};
