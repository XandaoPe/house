// MenuLateral.tsx - ADICIONE ESTES IMPORTS
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
    AccordionSummaryProps,
    accordionSummaryClasses,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    IconButton,
    Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HouseIcon from '@mui/icons-material/House';
import EngineeringIcon from '@mui/icons-material/Engineering';
import QuizIcon from '@mui/icons-material/Quiz';
import { ImoveisModal } from '../Modal/ImobModal';
import { CollaboratorsModal } from '../Modal/CollaboratorModal';
import { QuestionnairesModal } from '../Modal/QuestionnaireModal';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ReplyIcon from '@mui/icons-material/Reply';
import { ResponseQuestionsModal } from '../Modal/ResponseQuestionsModal';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupsIcon from '@mui/icons-material/Groups';
import GavelIcon from '@mui/icons-material/Gavel';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 300;

// Estilos do Accordion (mantenha os existentes)
const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    backgroundColor: 'transparent',
    color: 'white',
    boxShadow: 'none',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    marginBottom: '8px',
    '&:before': { display: 'none' },
    '&.Mui-expanded': {
        margin: 0,
        backgroundColor: 'rgba(32, 178, 170, 0.15)'
    },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem', color: 'white' }} />}
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

export default function MenuLateral() {
    const [expanded, setExpanded] = React.useState<string | false>(false);
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
    const [isModalOpenCollaborators, setIsModalOpenCollaborators] = React.useState<boolean>(false);
    const [isModalOpenQuestionnaires, setIsModalOpenQuestionnaires] = React.useState<boolean>(false);
    const [isModalOpenQuestionsResponses, setIsModalOpenQuestionsResponses] = React.useState<boolean>(false);
    const [innerExpanded, setInnerExpanded] = React.useState<string | false>(false);
    const [candidatosInnerExpanded, setCandidatosInnerExpanded] = React.useState<string | false>(false);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false);
    };

    const handleMainChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
        if (newExpanded) {
            setExpanded(panel);
        } else {
            setExpanded(false);
        }
    };

    const handleInnerChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
        setInnerExpanded(newExpanded ? panel : false);
    };

    const handleCandidatosInnerChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
        setCandidatosInnerExpanded(newExpanded ? panel : false);
    };

    // Funções para modais (mantenha as existentes)
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const handleOpenModalCollaborators = () => setIsModalOpenCollaborators(true);
    const handleCloseModalCollaborators = () => setIsModalOpenCollaborators(false);
    const handleOpenModalQuestionnaires = () => setIsModalOpenQuestionnaires(true);
    const handleCloseModalQuestionnaires = () => setIsModalOpenQuestionnaires(false);
    const handleOpenModalQuestionsResponses = () => setIsModalOpenQuestionsResponses(true);
    const handleCloseModalQuestionsResponses = () => setIsModalOpenQuestionsResponses(false);

    const drawer = (
        <Box sx={{
            width: drawerWidth,
            backgroundColor: '#1e1e1e',
            color: 'white',
            height: '100vh',
            padding: '16px'
        }}>
            {/* Cabeçalho do Menu */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                padding: '10px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
            }}>
                <Typography variant="h6" component="div">
                    Sistema
                </Typography>
                <IconButton
                    color="inherit"
                    onClick={handleLogout}
                    title="Sair"
                >
                    <LogoutIcon />
                </IconButton>
            </Box>

            {/* Informações do usuário */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px',
                padding: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '4px'
            }}>
                <Avatar sx={{
                    width: 40,
                    height: 40,
                    bgcolor: 'secondary.main',
                    marginRight: '10px'
                }}>
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {user?.name || 'Usuário'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {user?.email}
                    </Typography>
                </Box>
            </Box>

            {/* Conteúdo do Menu */}
            <Box sx={{ overflowY: 'hidden', overflowX: 'hidden' }}>
            {/* <Box sx={{
                overflow: 'hidden', // Remove a barra de scroll
                height: 'calc(100vh - 180px)',
                '&:hover': {
                    overflowY: 'auto' // Opcional: mostra scroll apenas ao passar o mouse
                }
            }}> */}

                <Accordion
                    expanded={expanded === 'panelCandidatos'}
                    onChange={handleMainChange('panelCandidatos')}
                >
                    <AccordionSummary aria-controls="panelCandidatos-content" id="panelCandidatos-header">
                        <GroupsIcon sx={{ mr: 1 }} />
                        <Typography component="span">Candidatos</Typography>
                    </AccordionSummary>
                        <AccordionDetails>
                            <Accordion
                                expanded={candidatosInnerExpanded === 'panelCandidatosCasas'}
                                onChange={handleCandidatosInnerChange('panelCandidatosCasas')}
                                // onClick={handleOpenModal}
                                sx={{ maxWidth: '100%', mb: 0 }}
                            >
                                <AccordionSummary aria-controls="panelCandidatosCasas-content" id="panelCandidatosCasas-header">
                                    <HouseIcon sx={{ mr: 1 }} />
                                    <Typography component="span">Casas</Typography>
                                </AccordionSummary>
                            </Accordion>
                            <Accordion
                                expanded={candidatosInnerExpanded === 'panelCandidatosRegras'}
                                onChange={handleCandidatosInnerChange('panelCandidatosRegras')}
                                sx={{ maxWidth: '100%', mb: 0 }}
                            >
                                <AccordionSummary aria-controls="panelCandidatosRegras-content" id="panelCandidatosRegras-header">
                                    <GavelIcon sx={{ mr: 1 }} />
                                    <Typography component="span">Regras</Typography>
                                </AccordionSummary>
                            </Accordion>
                            <Accordion
                                expanded={candidatosInnerExpanded === 'panelCandidatosQuestionario'}
                                onChange={handleCandidatosInnerChange('panelCandidatosQuestionario')}
                                sx={{ maxWidth: '100%', mb: 0 }}
                            >
                                <AccordionSummary aria-controls="panelCandidatosQuestionario-content" id="panelCandidatosQuestionario-header">
                                    <QuizIcon sx={{ mr: 1 }} />
                                    <Typography component="span">Questionário</Typography>
                                </AccordionSummary>
                            </Accordion>
                        </AccordionDetails>
                </Accordion>

                <Accordion
                    expanded={expanded === 'panelADM'}
                    onChange={handleMainChange('panelADM')}
                >
                    <AccordionSummary aria-controls="panelADM-content" id="panelADM-header">
                        <AdminPanelSettingsIcon sx={{ mr: 1 }} />
                        <Typography component="span">ADM</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Accordion
                            expanded={innerExpanded === 'panel1'}
                            onChange={handleInnerChange('panel1')}
                            onClick={handleOpenModal}
                            sx={{ maxWidth: '100%', mb: 0 }}
                        >
                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                <HouseIcon sx={{ mr: 1 }} />
                                <Typography component="span">Casas</Typography>
                            </AccordionSummary>
                        </Accordion>

                        <Accordion
                            expanded={innerExpanded === 'panel2'}
                            onChange={handleInnerChange('panel2')}
                            onClick={handleOpenModalCollaborators}
                            sx={{ maxWidth: '100%', mb: 0 }}
                        >
                            <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                                <EngineeringIcon sx={{ mr: 1 }} />
                                <Typography component="span">Candidatos</Typography>
                            </AccordionSummary>
                        </Accordion>

                        <Accordion
                            expanded={innerExpanded === 'panel3'}
                            onChange={handleInnerChange('panel3')}
                            sx={{ maxWidth: '100%', mb: 0 }}
                        >
                            <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                                <QuizIcon sx={{ mr: 1 }} />
                                <Typography component="span">Questionário</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Accordion
                                    expanded={innerExpanded === 'panel3a'}
                                    onChange={handleInnerChange('panel3a')}
                                    sx={{ maxWidth: '100%' }}
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
                                    sx={{ maxWidth: '100%' }}
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
                    </AccordionDetails>
                </Accordion>
            </Box>
        </Box>
    );

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    display: { sm: 'none' }
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Sistema
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Modais (mantenha os existentes) */}
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
            <ResponseQuestionsModal
                open={isModalOpenQuestionsResponses}
                onClose={handleCloseModalQuestionsResponses}
            />
        </>
    );
}