const bcrypt = require('bcryptjs');
const { User } = require('../../src/models');
const truncate = require('../utils/truncate');

describe('User', () => {
    beforeEach(async () => {
        await truncate();
    })

    it('should encrypt user passoword', async () => {
        const user = await User.create({
            name: 'Caio Torrez',
            email: 'caiotorrez@live.com',
            password: '123456'
        })
        const compareHash = await bcrypt.compare('123456', user.password_hash);
        expect(compareHash).toBe(true);
    })
})