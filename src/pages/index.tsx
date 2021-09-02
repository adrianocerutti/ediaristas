import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async () => {
	return {
		props: {
			title: "Meu título",
		},
	};
};

export default function Index() {
	return <div></div>;
}
