import http from './request';

export default {
    pullBranch(params: any) {
        return http.get('http://172.16.100.194:8080/op', params);
    },
};