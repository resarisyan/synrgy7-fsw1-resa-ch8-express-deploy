import { Model, ModelObject } from 'objection';

export class OauthProviderModel extends Model {
  id!: string;
  name!: string;
  email!: string;
  client_id!: string;
  client_secret!: string;
  redirect_uri!: string;

  static tableName = 'oauth_providers';
}

export type OauthProvider = ModelObject<OauthProviderModel>;
