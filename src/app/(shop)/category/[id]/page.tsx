import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

export default function CategoryPage({ params }: Props) {
  const { id } = params;
  const categories = ["kids", "men", "women"];

  if (!categories.includes(id)) {
    notFound();
  }

  return (
    <div>
      <h1>Category Page {id}</h1>
    </div>
  );
}
