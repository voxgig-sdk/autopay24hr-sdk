# Autopay24hr SDK utility registration
require_relative '../core/utility_type'
require_relative 'clean'
require_relative 'done'
require_relative 'make_error'
require_relative 'feature_add'
require_relative 'feature_hook'
require_relative 'feature_init'
require_relative 'fetcher'
require_relative 'make_fetch_def'
require_relative 'make_context'
require_relative 'make_options'
require_relative 'make_request'
require_relative 'make_response'
require_relative 'make_result'
require_relative 'make_point'
require_relative 'make_spec'
require_relative 'make_url'
require_relative 'param'
require_relative 'prepare_auth'
require_relative 'prepare_body'
require_relative 'prepare_headers'
require_relative 'prepare_method'
require_relative 'prepare_params'
require_relative 'prepare_path'
require_relative 'prepare_query'
require_relative 'graphql'
require_relative 'result_basic'
require_relative 'result_body'
require_relative 'result_headers'
require_relative 'transform_request'
require_relative 'transform_response'

Autopay24hrUtility.registrar = ->(u) {
  u.clean = Autopay24hrUtilities::Clean
  u.clean_add = Autopay24hrUtilities::CleanAdd
  u.clean_explain = Autopay24hrUtilities::CleanExplain
  u.done = Autopay24hrUtilities::Done
  u.make_error = Autopay24hrUtilities::MakeError
  u.feature_add = Autopay24hrUtilities::FeatureAdd
  u.feature_hook = Autopay24hrUtilities::FeatureHook
  u.feature_init = Autopay24hrUtilities::FeatureInit
  u.fetcher = Autopay24hrUtilities::Fetcher
  u.make_fetch_def = Autopay24hrUtilities::MakeFetchDef
  u.make_context = Autopay24hrUtilities::MakeContext
  u.make_options = Autopay24hrUtilities::MakeOptions
  u.make_request = Autopay24hrUtilities::MakeRequest
  u.make_response = Autopay24hrUtilities::MakeResponse
  u.make_result = Autopay24hrUtilities::MakeResult
  u.make_point = Autopay24hrUtilities::MakePoint
  u.make_spec = Autopay24hrUtilities::MakeSpec
  u.make_url = Autopay24hrUtilities::MakeUrl
  u.param = Autopay24hrUtilities::Param
  u.prepare_auth = Autopay24hrUtilities::PrepareAuth
  u.prepare_body = Autopay24hrUtilities::PrepareBody
  u.prepare_headers = Autopay24hrUtilities::PrepareHeaders
  u.prepare_method = Autopay24hrUtilities::PrepareMethod
  u.prepare_params = Autopay24hrUtilities::PrepareParams
  u.prepare_path = Autopay24hrUtilities::PreparePath
  u.prepare_query = Autopay24hrUtilities::PrepareQuery
  u.graphql_body = Autopay24hrUtilities::GraphqlBody
  u.graphql_errors = Autopay24hrUtilities::GraphqlErrors
  u.result_basic = Autopay24hrUtilities::ResultBasic
  u.result_body = Autopay24hrUtilities::ResultBody
  u.result_headers = Autopay24hrUtilities::ResultHeaders
  u.transform_request = Autopay24hrUtilities::TransformRequest
  u.transform_response = Autopay24hrUtilities::TransformResponse
}
