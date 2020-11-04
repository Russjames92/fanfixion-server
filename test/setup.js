require('dotenv').config

process.env.TEST_DATABASE_URL

const { expect } = require('chai')
const supertest = require('supertest')

global.expect = expect
global.supertest = supertest