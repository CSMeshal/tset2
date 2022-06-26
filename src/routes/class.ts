import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { upsertContactController } from '../controllers.ts/student';

const Building = Type.Object({
	id: Type.String({ format: 'uuid' }),
	name: Type.String(),
	Building: Type.String(),
});
type Building = Static<typeof Building>;

const GetContactsQuery = Type.Object({
	name: Type.Optional(Type.String()),
});
type GetContactsQuery = Static<typeof GetContactsQuery>;

export let classs: Building[] = [
	{ id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', name: 'class1', Building: '1' },
	{ id: '3fa85f64-5717-4562-b3fc-2c963f66afa5', name: 'class2', Building: '2' },
	{ id: '3fa85f64-5717-4562-b3fc-2c963f66afa2', name: 'class3', Building: '3' },
	{ id: '3fa85f64-5717-4562-b3fc-2c963f66afa1', name: 'class4', Building: '4' },
	{ id: '3fa85f64-5717-4562-b3fc-2c963f66afa3', name: 'class5', Building: '5' },
];

export default async function (server: FastifyInstance) {
	server.route({
		method: 'PUT',
		url: '/classs',
		schema: {
			summary: 'Creates new classs ',
			tags: ['classs'],
			body: Building,
		},
		handler: async (request, reply) => {
			const newContact: any = request.body;
			return upsertContactController(classs, newContact);
		},
	});

	server.route({
		method: 'PATCH',
		url: '/classs/:id',
		schema: {
			summary: 'Update a contact by id + you dont need to pass all properties',
			tags: ['classs'],
			body: Type.Partial(Building),
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const newContact: any = request.body;
			return upsertContactController(classs, newContact);
		},
	});

	server.route({
		method: 'DELETE',
		url: '/classs/:id',
		schema: {
			summary: 'Deletes a classs',
			tags: ['classs'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			classs = classs.filter((c) => c.id !== id);

			return classs;
		},
	});

	server.route({
		method: 'GET',
		url: '/classs/:id',
		schema: {
			summary: 'Returns one classs or null',
			tags: ['classs'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
			response: {
				'2xx': Type.Union([Building, Type.Null()]),
			},
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			return classs.find((c) => c.id === id) ?? null;
		},
	});

	server.route({
		method: 'GET',
		url: '/classs',
		schema: {
			summary: 'Gets all classs',
			tags: ['classs'],
			querystring: GetContactsQuery,
			response: {
				'2xx': Type.Array(Building),
			},
		},
		handler: async (request, reply) => {
			const query = request.query as GetContactsQuery;

			if (query.name) {
				return classs.filter((c) => c.name.includes(query.name ?? ''));
			} else {
				return classs;
			}
		},
	});
}
