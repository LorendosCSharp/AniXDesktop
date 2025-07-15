import Link from "next/link";

// const searchBy = {
//   title:  0,
//   studio:  1,
//   director:  2,
//   author:  3,
//   genre:  4
// }

// TODO: сделать какую-нибудь анимацию на ссылке при наведении и фокусе
export const ReleaseInfoSearchLink = (props: { title: string, searchBy: string | number | null }) => {
  return (
    <Link
      className="underline"
      href={`/search?q=${props.title}&searchBy=${props.searchBy}`}
    >
      {props.title}
    </Link>
  );
};
