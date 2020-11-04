const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const supertest = require('supertest')
const EpisodeService = require('../src/episodes/episodes-service')

describe('fanfixion endpoints', () => {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })
    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('fanfixion_episodes').truncate())

    context('Given there are episodes in the database', () => {
        const testEpisodes = [
            {
                id: 1,
                image: null,
                title: 'First Test Post',
                content: 'First Test Content',
                date_created: '2029-01-22T16:28:32.615Z',
            },
            {
                id: 2,
                image: null,
                title: 'Second Test Post',
                content: 'Second Test Content',
                date_created: '2029-01-22T16:28:32.615Z',
            },
            {
                id: 3,
                image: null,
                title: 'Third Test Post',
                content: 'Third Test Content',
                date_created: '2029-01-22T16:28:32.615Z',
            },
        ];
        beforeEach('insert episode', () => {
            return db
                .into('fanfixion_episodes')
                .insert(testEpisodes)
        })

        it('GET / episodes reponds with 200 and all of the episodes', () => {
            return supertest(app)
                .get('/api/episodes')
                .expect(200, EpisodeService.serializeEpisodes(testEpisodes))
        })

        it('POST /')
    })
})