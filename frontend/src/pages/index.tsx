import Image from 'next/image';
import logo from '../../public/images/6365344.jpg';
import section2 from '../../public/images/10051772.jpg'
import { useContext } from 'react';
import { UserContext } from '@/components/Layout';
import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material';


export default function Home() {
  const { userId } = useContext(UserContext);

  if (userId) {
    console.log("ID de l'utilisateur dans Layout :", userId);
  }
  return (
    <>
      <Box
        className="banner"
        sx={{
          backgroundImage: 'url("/images/road.avif")',
          backgroundSize: 'cover',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start', // Aligne le contenu en haut
          alignItems: 'flex-start', // Aligne le contenu à gauche
          textAlign: 'left', // Aligne le texte à gauche
          color: 'white',
          paddingLeft: '200px',
          paddingTop: "350px  " // Ajoute un espacement à gauche (ajustez selon vos besoins)
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          <span>ECO</span>DRIVE
        </Typography>
        <Typography variant="h6" gutterBottom>
          Vous cherchez un trajet ?
        </Typography>
        <Typography variant="body1" gutterBottom>
          Trouvez le trajet qui vous convient le mieux et réservez votre place tout de suite !
        </Typography>
        <Button variant="contained" onClick={(e) => e.preventDefault()}>
          Trouvez un trajet
        </Button>
      </Box>
      <Container sx={{ py: 20 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Image src={logo} alt="Description de l'image" width={500} height={300} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h2" gutterBottom>
              qdsfsfgsdfs
            </Typography>
            <Typography variant="body1">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam sit totam ipsa consequatur eveniet minima magni numquam architecto tenetur nisi rem consectetur, eos nulla. Praesentium voluptates doloribus fugit et soluta?
            </Typography>
          </Grid>
        </Grid>
      </Container>

      <Container sx={{ py: 20 }}>
        <Grid container spacing={4} direction="row-reverse">
          <Grid item xs={12} md={6}>
            <Image src={section2} alt="Description de l'image" width={500} height={300} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h2" gutterBottom>
              qdsfsfgsdfs
            </Typography>
            <Typography variant="body1">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam sit totam ipsa consequatur eveniet minima magni numquam architecto tenetur nisi rem consectetur, eos nulla. Praesentium voluptates doloribus fugit et soluta?
            </Typography>
          </Grid>
        </Grid>
      </Container>

      <Container sx={{ py: 20 }}>
        <Grid container spacing={4} justifyContent="space-around">
          <Grid item xs={12} md={3}>
            <Paper sx={{ padding: 2, textAlign: 'center' }}>
              <Typography variant="h6" component="h3" gutterBottom>
                LOREM IPSUM
              </Typography>
              <Typography variant="body2">
                Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de limprimerie depuis les années 1500.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ padding: 2, textAlign: 'center' }}>
              <Typography variant="h6" component="h3" gutterBottom>
                LOREM IPSUM
              </Typography>
              <Typography variant="body2">
                Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l&#39;imprimerie depuis les années 1500.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ padding: 2, textAlign: 'center' }}>
              <Typography variant="h6" component="h3" gutterBottom>
                LOREM IPSUM
              </Typography>
              <Typography variant="body2">
                Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l&#39;imprimerie depuis les années 1500.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Box component="footer" sx={{ textAlign: 'center', py: 10, backgroundColor: '#f0f0f0' }}>
        <Typography variant="body2">
          Footer @Copyright 2025-2026
        </Typography>
      </Box>
    </>
  );
}
