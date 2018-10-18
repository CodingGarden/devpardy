import Datastore from 'nedb-promises';
import path from 'path';
import { remote } from 'electron';

const categories = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/categories.db'),
});

const games = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/games.db'),
});

const playedGames = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/played-games.db'),
});

export default {
  categories,
  games,
  playedGames,
};
