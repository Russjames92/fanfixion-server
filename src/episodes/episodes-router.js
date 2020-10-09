const express = require('express')
const path = require('path')
const EpisodesService = require('./episodes-service')
const { requireAuth } = require('../middleware/jwt-auth')

const episodesRouter = express.Router()
const jsonBodyParser = express.json()

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
    .post(jsonBodyParser, (req, res, next) => {
        const { title, content, image } = req.body
        const newEpisode = { title, content, image }

        for (const [key, value] of Object.entries(newEpisode))
            if (value === null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })
        // newEpisode.user_id = req.user.getById
        EpisodesService.insertEpisode(
            req.app.get('db'),
            newEpisode
        )
            .then(episode => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${episode.id}`))
                    .json(EpisodesService.serializeEpisode(episode))
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
    .delete((req, res, next) => {
        EpisodesService.deleteEpisode(
            req.app.get('db'),
            req.params.episode_id
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonBodyParser, (req, res, next) => {
        const { title, content, image } = req.body
        const episodeToUpdate = { title, content, image }

        const numberOfValues = Object.values(episodeToUpdate).filter(Boolean).length
        if (numberOfValues === 0)
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'title', 'content', of 'image'`
                }
            })
        EpisodesService.updateEpisode(
            req.app.get('db'),
            req.params.episode_id,
            episodeToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
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