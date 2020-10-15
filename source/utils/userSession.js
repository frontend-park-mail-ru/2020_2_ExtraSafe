import network from './network.js';
import eventBus from './eventBus.js';

/**
 * User session
 */
class UserSession {
    /**
     * User session constructor
     */
    constructor() {
        this.data = {};
        this.resetData();
        eventBus.on('network:logout', (input) => {
            this.resetData();
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
        eventBus.emit('userSession:set', this.data);
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
}

export default new UserSession();
