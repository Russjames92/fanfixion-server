const xss = require('xss')
const Treeize = require('treeize')

const EpisodesService = {
    getAllEpisodes(db) {
        return db
            .from('fanfixion_episodes AS fe')
            .select(
                'fe.id',
                'fe.title',
                'fe.image',
                'fe.content',
                'fe.date_created',
                ...userFields,
            )
            .leftJoin(
                'fanfixion_users AS usr',
                'fe.user_id',
                'usr.id',
            )
            .groupBy('fe.id', 'usr.id')
    },

    getById(db, id) {
        return EpisodesService.getAllEpisodes(db)
            .where('fe.id', id)
            .first()
    },

    serializeEpisodes(episodes) {
        return episodes.map(this.serializeEpisode)
    },

    serializeEpisode(episode) {
        const episodeTree = new Treeize()
        const episodeData = episodeTree.grow([ episode ]).getData()[0]

        return {
            id: episodeData.id,
            title: xss(episodeData.title),
            content: xss(episodeData.content),
            image: episodeData.image,
            date_created: episodeData.date_created,
            user: episodeData.user || {},
        }
    },
}

const userFields = [
    'usr.id AS user:id',
    'usr.user_name AS user:user_name',
    'usr.full_name AS user:full_name',
    'usr.date_created AS user:date_created',
]

module.exports = EpisodesService