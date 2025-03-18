import type React from "react";

const TextInput = (
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) => {
  return <textarea {...props} className="border-2 rounded-md p-4 w-full" />;
};

export default TextInput;
