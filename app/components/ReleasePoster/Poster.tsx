import Image from "next/image";

export const Poster = (props: {
  image: string;
  alt?: string;
  className?: string;
}) => {
  return (
    <Image
      className={`object-cover rounded-lg shadow-md ${props.className}`}
      // className="w-[285px] max-h-[385px] object-cover border border-gray-200 rounded-lg shadow-md dark:border-gray-700"
      src={props.image}
      alt={props.alt || ""}
      width={285}
      height={385}
      style={{
        width: "100%",
        height: "auto",
      }}
    />
  );
};
