export const getParentDescription = ({
  description,
  name,
}: {
  description: string;
  name: string;
}) => {
  const nameIndex = description.lastIndexOf(name);
  if (nameIndex === -1) return description;
  return description.substring(0, nameIndex).trim();
};
