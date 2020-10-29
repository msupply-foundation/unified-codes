import S, { ObjectSchema } from 'fluent-schema';
import StatusCodes from 'http-status-codes';

import { Schema } from '../types';

export enum ItemsQueryParams {
  Code = 'code',
  Name = 'name',
  Exact = 'exact',
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export enum ItemsSuccessParams { };

export enum ItemsErrorParams {
  Error = 'error'
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
enum HealthQueryParams { };

export enum HealthSuccessParams {
  MySql = 'mysql',
  Api = 'api',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export enum HealthErrorParams { };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export enum VersionQueryParams { };

export enum VersionSuccessParams {
  Version = 'version',
  VersionShort = 'versionShort',
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
enum VersionErrorParams { };

export const itemsQueryString: ObjectSchema =
  S.object()
    .prop(ItemsQueryParams.Code, S.string())
    .prop(ItemsQueryParams.Name, S.string())
    .prop(ItemsQueryParams.Exact, S.boolean())

export const itemsSuccessParams = S.object();

export const itemsErrorParams =
  S.object()
    .prop(ItemsErrorParams.Error, S.string())

export const healthQueryString: ObjectSchema = S.object();

export const healthSuccessParams: ObjectSchema =
  S.object()
    .prop(HealthSuccessParams.MySql, S.string())
    .prop(HealthSuccessParams.Api, S.string());

export const healthErrorParams: ObjectSchema = S.object();

export const versionQueryString: ObjectSchema = S.object();

export const versionSuccessParams = S.object()
  .prop(VersionSuccessParams.Version, S.string())
  .prop(VersionSuccessParams.VersionShort, S.string());

export const versionErrorParams: ObjectSchema = S.object();

export const itemsResponse = {
  [StatusCodes.OK]: itemsSuccessParams,
  [StatusCodes.NOT_FOUND]: itemsErrorParams,
}

export const healthResponse = {
  [StatusCodes.OK]: healthSuccessParams,
  [StatusCodes.NOT_FOUND]: healthErrorParams,
}

export const versionResponse = {
  [StatusCodes.OK]: versionSuccessParams,
  [StatusCodes.NOT_FOUND]: versionErrorParams,
}

export const itemsSchema: Schema = {
  querystring: itemsQueryString,
  response: itemsResponse,
};

export const healthSchema: Schema = {
  querystring: healthQueryString,
  response: healthResponse,
}

export const versionSchema: Schema = {
  response: versionResponse,
};

export const schema = { health: healthSchema, items: itemsSchema, version: versionSchema };

export default schema;
