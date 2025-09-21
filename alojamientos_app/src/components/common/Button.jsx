const Button = ({ children, onClick, type = 'button', disabled = false, variant = 'primary', className = '' }) => {
  const baseClasses = "w-full py-2 px-4 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 border";
  
  const variants = {
    primary: "bg-[#677683] text-[#B5B7B1] hover:bg-[#5C4B43] focus:ring-[#A8BBC1] border-[#A8BBC1] hover:border-[#B5B7B1]",
    secondary: "bg-[#5C4B43] text-[#B5B7B1] hover:bg-[#677683] focus:ring-[#A8BBC1] border-[#677683]",
    success: "bg-green-700 text-[#B5B7B1] hover:bg-green-600 focus:ring-green-400 border-green-600"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;