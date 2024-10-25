import { BACKEND_PORT } from '../env';
import * as CredibleCupid from '../credible_cupid/src/index'

export default function InitDefaultCredibleCupidClient(jwt) {
  let defaultClient = CredibleCupid.ApiClient.instance;
  defaultClient.basePath = 'http://localhost:' + BACKEND_PORT;

  if (jwt) {
    defaultClient.authentications['bearer'].accessToken = jwt;
  }

  return defaultClient;
}