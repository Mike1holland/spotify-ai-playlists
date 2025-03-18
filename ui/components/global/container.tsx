import type React from "react";

const Container = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="flex flex-col mx-auto max-w-2xl items-center justify-center h-screen px-4">
      {children}
    </div>
  );
};

export default Container;
