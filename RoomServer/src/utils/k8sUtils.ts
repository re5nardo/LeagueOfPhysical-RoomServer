import { logger } from '@utils/logger';
import * as k8s from '@kubernetes/client-node';

export class k8sUtils {
    private static k8sApi: k8s.CoreV1Api;

    static {
        const kc = new k8s.KubeConfig();
        kc.loadFromDefault();
        k8sUtils.k8sApi = kc.makeApiClient(k8s.CoreV1Api);
    }

    public static async createPod(podManifest: k8s.V1Pod, namespace: string = 'default'): Promise<k8s.V1Pod> {
        try {
            await k8sUtils.ensureNamespaceExists(namespace);
            const { response, body } = await k8sUtils.k8sApi.createNamespacedPod(namespace, podManifest);
            logger.info(`Pod created successfully: ${body.metadata?.name}`);
            return body;
        } catch (error) {
            logger.error(`Failed to create pod: ${error}`);
            throw error;
        }
    }

    public static async createService(serviceManifest: k8s.V1Service, namespace: string = 'default'): Promise<k8s.V1Service> {
        try {
            await k8sUtils.ensureNamespaceExists(namespace);
            const { response, body } = await k8sUtils.k8sApi.createNamespacedService(namespace, serviceManifest);
            logger.info(`Service created successfully: ${body.metadata?.name}`);
            return body;
        } catch (error) {
            logger.error(`Failed to create service: ${error}`);
            throw error;
        }
    }

    public static async deletePod(name: string, namespace: string = 'default'): Promise<void> {
        try {
            await k8sUtils.ensureNamespaceExists(namespace);
            await k8sUtils.k8sApi.deleteNamespacedPod(name, namespace);
            logger.info(`Pod deleted successfully: ${name}`);
        } catch (error: any) {
            if (error.response?.statusCode === 404) {
                logger.info(`Pod ${name} does not exist in namespace ${namespace}`);
            } else {
                logger.error(`Error deleting Pod: ${error}`);
            }
        }
    }

    public static async deleteService(name: string, namespace: string = 'default'): Promise<void> {
        try {
            await k8sUtils.ensureNamespaceExists(namespace);
            await k8sUtils.k8sApi.deleteNamespacedService(name, namespace);
            logger.info(`Service deleted successfully: ${name}`);
        } catch (error: any) {
            if (error.response?.statusCode === 404) {
                logger.info(`Service ${name} does not exist in namespace ${namespace}`);
            } else {
                logger.error(`Error deleting Service: ${error}`);
            }
        }
    }

    public static async listPods(namespace: string = 'default'): Promise<k8s.V1PodList> {
        try {
            await k8sUtils.ensureNamespaceExists(namespace);
            const { response, body } = await k8sUtils.k8sApi.listNamespacedPod(namespace);
            return body;
        } catch (error) {
            logger.error(`Error listing Pods: ${error}`);
            return new k8s.V1PodList();
        }
    }

    public static async listServices(namespace: string = 'default'): Promise<k8s.V1ServiceList> {
        try {
            await k8sUtils.ensureNamespaceExists(namespace);
            const { response, body } = await k8sUtils.k8sApi.listNamespacedService(namespace);
            return body;
        } catch (error) {
            logger.error(`Error listing Services: ${error}`);
            return new k8s.V1ServiceList();
        }
    }

    private static async ensureNamespaceExists(namespace: string): Promise<void> {
        try {
            await k8sUtils.k8sApi.readNamespace(namespace);
        } catch (error: any) {
            if (error.response && error.response.statusCode === 404) {
                logger.info(`Namespace ${namespace} does not exist. Creating it.`);
                const namespaceManifest: k8s.V1Namespace = {
                    metadata: {
                        name: namespace
                    }
                };
                await k8sUtils.k8sApi.createNamespace(namespaceManifest);
            } else {
                throw error;
            }
        }
    }
}
