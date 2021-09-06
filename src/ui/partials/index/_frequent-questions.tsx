import { useState } from "react";
import {
	SectionContainer,
	Wave,
	SectionTitle,
	SectionSubTitle,
	AccordionStyled,
} from "./_frequent-questions.styled";
import {
	AccordionSummary,
	AccordionDetails,
	Typography,
	Container,
} from "@material-ui/core";

const questionList = [
	{
		question: "Dúvida 1",
		answer:
			"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa alias amet corporis maiores totam quisquam non, dicta nesciunt aspernatur aut? Enim atque maxime nulla. Delectus eveniet accusamus veritatis dolor repudiandae.",
	},
	{
		question: "Dúvida 2",
		answer:
			"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa alias amet corporis maiores totam quisquam non, dicta nesciunt aspernatur aut? Enim atque maxime nulla. Delectus eveniet accusamus veritatis dolor repudiandae.",
	},
	{
		question: "Dúvida 3",
		answer:
			"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa alias amet corporis maiores totam quisquam non, dicta nesciunt aspernatur aut? Enim atque maxime nulla. Delectus eveniet accusamus veritatis dolor repudiandae.",
	},
	{
		question: "Dúvida 4",
		answer:
			"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa alias amet corporis maiores totam quisquam non, dicta nesciunt aspernatur aut? Enim atque maxime nulla. Delectus eveniet accusamus veritatis dolor repudiandae.",
	},
];

const FrequentQuestions = () => {
	const [activeAccordion, setActiveAccordion] = useState(0);

	function isOpen(accordionNumber: number): boolean {
		return activeAccordion === accordionNumber;
	}

	function changeOpenAccordion(accordionNumber: number) {
		setActiveAccordion(accordionNumber);
		if (isOpen(accordionNumber)) {
			setActiveAccordion(0);
		} else {
			setActiveAccordion(accordionNumber);
		}
	}

	function getIcon(accordionNumber: number) {
		return isOpen(accordionNumber) ? "twf-minus" : "twf-plus";
	}

	return (
		<SectionContainer>
			<Wave src={"/img/home/waves.svg"} />
			<Container>
				<SectionTitle>Ainda está com dúvidas?</SectionTitle>
				<SectionSubTitle>
					Veja abaixo as perguntas frequentes
				</SectionSubTitle>

				{questionList.map((item, index) => (
					<AccordionStyled
						key={index}
						expanded={isOpen(index + 1)}
						onChange={() => changeOpenAccordion(index + 1)}
					>
						<AccordionSummary
							expandIcon={<i className={getIcon(index + 1)} />}
						>
							<Typography color={"primary"}>
								{item.question}
							</Typography>
						</AccordionSummary>
						<AccordionDetails>{item.answer}</AccordionDetails>
					</AccordionStyled>
				))}
			</Container>
		</SectionContainer>
	);
};

export default FrequentQuestions;
