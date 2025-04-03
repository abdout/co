import React, { useState } from 'react';

const clubTags = [
  { label: "العامة", size: 20, value: "general" },
  { label: "المجتمع", size: 18, value: "community" },
  { label: "الثقافية", size: 22, value: "culture" },
  { label: "الاقتصاد", size: 19, value: "economy" },
  { label: "المرأة", size: 21, value: "women" },
  { label: "الطلاب", size: 18, value: "students" },
  { label: "الاعلام", size: 23, value: "media" },
  { label: "التقنية", size: 20, value: "technology" },
  { label: "الفكر", size: 19, value: "thought" },
  { label: "السياسة", size: 22, value: "politics" }
];


interface Club {
  label: string;
  size: number;
  value: string; // Add the 'value' property
}


interface TagProps {
  setTag: (club: Club) => void; // Update type to pass full club object
}

const Tag: React.FC<TagProps> = (props) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTag = (tag: Club) => {
    setSelectedTags([tag.label]);
    props.setTag(tag); // Pass the full club object instead of just label
  };

  return (
    <div className="flex flex-wrap">
      {clubTags.map((item, index) => (
        <span 
          key={index} 
          style={{ 
            fontSize: `${item.size}px`,
            opacity: selectedTags.includes(item.label) ? 1 : 0.5
          }}
          className="m-1 p-1 cursor-pointer"
          onClick={() => handleTag(item)}
        >
          {item.label}
        </span>
      ))}
    </div>
  );
};

export default Tag;
