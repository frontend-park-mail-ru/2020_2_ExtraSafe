import network from './network.js';
import globalEventBus from './globalEventBus.js';

/**
 * User session
 */
class UserSession {
    /**
     * User session constructor
     */
    constructor() {
        this.data = {};
        this.accounts = {};
        this.boards = [];
        this.resetData();
        this.resetAccounts();
        globalEventBus.on('network:logout', (input) => {
            this.resetData();
            this.resetAccounts();
        });
    };

    /**
     * Set data
     * @param {json} val
     */
    setData(val) {
        this.data.email = val.email;
        this.data.username = val.username;
        this.data.fullName = val.fullName;
        this.data.avatar = network.serverAddr + '/avatar/' + val.avatar;
        globalEventBus.emit('userSession:set', this.data);
    }

    /**
     * reset data to default values
     */
    resetData() {
        this.setData({
            email: '',
            username: '',
            fullName: '',
            avatar: `default/default_avatar.png`,
        });
    }

    /**
     * Set accounts
     * @param {json} val
     */
    setAccounts(val) {
        this.accounts.telegram = val.links.telegram;
        this.accounts.instagram = val.links.instagram;
        this.accounts.github = val.links.github;
        this.accounts.bitbucket = val.links.bitbucket;
        this.accounts.vkontakte = val.links.vkontakte;
        this.accounts.facebook = val.links.facebook;
        globalEventBus.emit('userSession:setAccounts', this.accounts);
    }

    /**
     * Set boards
     * @param {json} val
     */
    setBoards(val) {
        this.boards = val.boards;
        globalEventBus.emit('userSession:setBoards', this.boards);
    }

    /**
     * reset data to default values
     */
    resetAccounts() {
        this.setAccounts({
            links: {
                telegram: '',
                instagram: '',
                github: '',
                bitbucket: '',
                vkontakte: '',
                facebook: '',
            },
        });
    }
}

export default new UserSession();
