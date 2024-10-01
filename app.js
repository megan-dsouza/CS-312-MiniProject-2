const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let posts = [];


const WEATHER_API_KEY = 'ed9822d9bf692009e95ac02e62d0cbf8'; 
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

app.get('/', (req, res) => {
    const weather = req.query.weather ? JSON.parse(req.query.weather) : null;
    res.render('index', { posts: posts, weather: weather });
});

app.post('/create', async (req, res) => {
    const post = {
        name: req.body.name,
        title: req.body.title,
        content: req.body.content,
        date: new Date().toLocaleDateString(),
    };

    const city = req.body.city;
    let weather = null;

    if (city) {
        try {
            const response = await axios.get(WEATHER_API_URL, {
                params: {
                    q: city,
                    appid: WEATHER_API_KEY,
                    units: 'metric', 
                },
            });
            weather = response.data; 
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }

    posts.push(post);
    res.redirect('/?weather=' + JSON.stringify(weather)); 
});

app.post('/delete/:index', (req, res) => {
    const index = req.params.index;
    posts.splice(index, 1);
    res.redirect('/');
});

app.get('/edit/:index', (req, res) => {
    const index = req.params.index;
    const post = posts[index];
    res.render('edit', { post: post, index: index });
});

app.post('/edit/:index', (req, res) => {
    const index = req.params.index;
    posts[index].title = req.body.title;
    posts[index].content = req.body.content;
    res.redirect('/');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
