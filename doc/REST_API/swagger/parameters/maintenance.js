/**
 * @swagger
 * parameter:
 *   maintenance_elasticsearch_action:
 *     name: action
 *     in: query
 *     description: Action to maintain Elasticsearch
 *     required: true
 *     type: string
 *     enum:
 *       - 'reconfigure'
 *       - 'reindex'
 *   maintenance_elasticsearch_resource_type:
 *     name: resource_type
 *     in: query
 *     description: Resource type to excute the maintainance action for Elasticsearch. <br>
 *       - If the value is "all", the maintain action will be applied for all the supported resource types
 *     required: true
 *     type: string
**/
