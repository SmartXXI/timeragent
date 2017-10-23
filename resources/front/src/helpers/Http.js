import axios from 'axios';

const Http = axios.create({
    headers: {
        'X-CSRF-Token': window.Laravel.csrfToken,
    },
});

export default Http;
