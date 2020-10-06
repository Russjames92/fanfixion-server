const express = require('express')
const EpisodesService = require('./episodes-service')
const { requireAuth } = require('../middleware/jwt-auth')

const episodesRouter = express.Router()

episodesRouter
    .route('/')
    // .all(requireAuth)
    .get((req, res, next) => {
        EpisodesService.getAllEpisodes(req.app.get('db'))
            .then(episodes => {
                res.json(EpisodesService.serializeEpisodes(episodes))
            })
            .catch(next)
    })

episodesRouter
    .route('/:episode_id')
    // .all(requireAuth)
    .all(checkEpisodeExists)
    .get((req, res) => {
        res.json(EpisodesService.serializeEpisode(res.episode))
    })

async function checkEpisodeExists(req, res, next) {
    try {
        const episode = await EpisodesService.getById(
            req.app.get('db'),
            req.params.episode_id
        )

        if(!episode)
            return res.status(404).json({
                error: `Episode doesn't exist`
            })
        
        res.episode = episode
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = episodesRouter