const Input = ({ label, type = 'text', name, value, onChange, placeholder, error, className = '' }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-[#A8BBC1] text-sm font-bold mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name} 
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8BBC1] bg-[#5C4B43] text-[#B5B7B1] placeholder-[#A8BBC1] ${
          error ? 'border-red-500' : 'border-[#677683]'
        } ${className}`}
      />
      {error && <p className="text-red-300 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Input;