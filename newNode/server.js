import app from './src/app';
import config from './config';

const { PORT } = config;

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));