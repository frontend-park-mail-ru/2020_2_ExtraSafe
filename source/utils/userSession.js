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
     * Set data
     * @param {json} val
     */
    setAccounts(val) {
        this.accounts.telegram = val.telegram;
        this.accounts.instagram = val.instagram;
        this.accounts.github = val.github;
        this.accounts.bitbucket = val.bitbucket;
        this.accounts.vkontakte = val.vkontakte;
        this.accounts.facebook = val.facebook;
        globalEventBus.emit('userSession:setAccounts', this.accounts);
    }

    /**
     * reset data to default values
     */
    resetAccounts() {
        this.setAccounts({
            telegram: '',
            instagram: '',
            github: '',
            bitbucket: '',
            vkontakte: '',
            facebook: '',
        });
    }
}

export default new UserSession();
