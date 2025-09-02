import React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
    AccordionSummaryProps,
    accordionSummaryClasses,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { Box, Button } from '@mui/material';
import HouseIcon from '@mui/icons-material/House';
import EngineeringIcon from '@mui/icons-material/Engineering';
import QuizIcon from '@mui/icons-material/Quiz';
import { ImoveisModal } from '../Modal/ImobModal';
import { CollaboratorsModal } from '../Modal/CollaboratorModal';
import { QuestionnairesModal } from '../Modal/QuestionnaireModal';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ReplyIcon from '@mui/icons-material/Reply';
import { ResponsesModal } from '../Modal/ResponseModal';
import { ResponseQuestionsModal } from '../Modal/ResponseQuestionsModal';

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    backgroundColor: 'transparent',
    maxWidth: '30%',
    color: 'white',
    boxShadow: 'none',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    mb: 2,
    '&:before': { display: 'none' },
    '&.Mui-expanded': {
        margin: 0,
        backgroundColor: 'rgba(32, 178, 170, 0.15)'
    },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor: 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
        transform: 'rotate(90deg)',
    },
    [`& .${accordionSummaryClasses.content}`]: {
        marginLeft: theme.spacing(1),
    },
    ...theme.applyStyles('dark', {
        backgroundColor: 'rgba(255, 255, 255, .05)',
    }),
    '&:hover .MuiTypography-root': {
        color: 'rgba(173, 239, 235, 0.5)',
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function Menu() {
    const [expanded, setExpanded] = React.useState<string | false>('panel1');
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
    const [isModalOpenCollaborators, setIsModalOpenCollaborators] = React.useState<boolean>(false);
    const [isModalOpenQuestionnaires, setIsModalOpenQuestionnaires] = React.useState<boolean>(false);
    const [isModalOpenQuestionsResponses, setIsModalOpenQuestionsResponses] = React.useState<boolean>(false);
    const [isModalOpenResponses, setIsModalOpenResponses] = React.useState<boolean>(false);
    const [innerExpanded, setInnerExpanded] = React.useState<string | false>(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const handleOpenModalCollaborators = () => setIsModalOpenCollaborators(true);
    const handleCloseModalCollaborators = () => setIsModalOpenCollaborators(false);
    const handleOpenModalQuestionnaires = () => setIsModalOpenQuestionnaires(true);
    const handleCloseModalQuestionnaires = () => setIsModalOpenQuestionnaires(false);
    const handleOpenModalResponses = () => setIsModalOpenResponses(true);
    const handleCloseModalResponses = () => setIsModalOpenResponses(false);
    const handleOpenModalQuestionsResponses = () => setIsModalOpenQuestionsResponses(true);
    const handleCloseModalQuestionsResponses = () => setIsModalOpenQuestionsResponses(false);

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
            setExpanded(newExpanded ? panel : false);
        };

    const handleInnerChange =
        (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
            setInnerExpanded(newExpanded ? panel : false);
        };

    return (
        <Box>
            <Accordion
                expanded={expanded === 'panel1'}
                onChange={handleChange('panel1')}
                onClick={handleOpenModal}
            >
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <HouseIcon sx={{ mr: 1 }} />
                    <Typography component="span">Casas</Typography>
                </AccordionSummary>
            </Accordion>

            <Accordion
                expanded={expanded === 'panel2'}
                onChange={handleChange('panel2')}
                onClick={handleOpenModalCollaborators}
            >
                <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                    <EngineeringIcon sx={{ mr: 1 }} />
                    <Typography component="span">Candidatos</Typography>
                </AccordionSummary>
            </Accordion>

            <Accordion
                expanded={expanded === 'panel3'}
                onChange={handleChange('panel3')}
            >
                <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                    <QuizIcon sx={{ mr: 1 }} />
                    <Typography component="span">Questionário</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Accordion
                        expanded={innerExpanded === 'panel3a'}
                        onChange={handleInnerChange('panel3a')}
                        sx={{ maxWidth: '100%' }} // Ajusta a largura para o container
                    >
                        <AccordionSummary 
                        aria-controls="panel3a-content" 
                        id="panel3a-header" 
                        onClick={handleOpenModalQuestionnaires}
                        >
                            <QuestionAnswerIcon sx={{ mr: 1 }} />
                            <Typography component="span">Questões</Typography>
                        </AccordionSummary>
                    </Accordion>

                    <Accordion
                        expanded={innerExpanded === 'panel3c'}
                        onChange={handleInnerChange('panel3c')}
                        sx={{ maxWidth: '100%' }} // Ajusta a largura para o container
                    >
                        <AccordionSummary 
                        aria-controls="panel3b-content" 
                        id="panel3b-header"
                        onClick={handleOpenModalQuestionsResponses}
                        >
                            <ReplyIcon sx={{ mr: 1 }} />
                            <Typography component="span">Respostas</Typography>
                        </AccordionSummary>

                    </Accordion>
                </AccordionDetails>
            </Accordion>

            <ImoveisModal
                open={isModalOpen}
                onClose={handleCloseModal}
            />
            <CollaboratorsModal
                open={isModalOpenCollaborators}
                onClose={handleCloseModalCollaborators}
            />
            <QuestionnairesModal
                open={isModalOpenQuestionnaires}
                onClose={handleCloseModalQuestionnaires}
            />
            {/* <ResponsesModal
                open={isModalOpenResponses}
                onClose={handleCloseModalResponses}
            /> */}
            <ResponseQuestionsModal
                open={isModalOpenQuestionsResponses}
                onClose={handleCloseModalQuestionsResponses}
            />
        </Box>
    );
}