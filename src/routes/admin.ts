import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { upsertContactController } from '../controllers.ts/student';

const Contact = Type.Object({
	id: Type.String({ format: 'uuid' }),
	name: Type.String(),
	phone: Type.String(),
});
type Contact = Static<typeof Contact>;

const GetContactsQuery = Type.Object({
	name: Type.Optional(Type.String()),
});
type GetContactsQuery = Static<typeof GetContactsQuery>;

export let admin: Contact[] = [
	{ id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', name: 'ali', phone: '0511111111' },
];

export default async function (server: FastifyInstance) {
	server.route({
		method: 'PUT',
		url: '/admin',
		schema: {
			summary: 'Creates new student + all properties are required',
			tags: ['student'],
			body: Contact,
		},
		handler: async (request, reply) => {
			const newContact: any = request.body;
			return upsertContactController(admin, newContact);
		},
	});

	server.route({
		method: 'PATCH',
		url: '/admin/:id',
		schema: {
			summary: 'Update a student by id + you dont need to pass all properties',
			tags: ['student'],
			body: Type.Partial(Contact),
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const newContact: any = request.body;
			return upsertContactController(admin, newContact);
		},
	});

	server.route({
		method: 'DELETE',
		url: '/admin/:id',
		schema: {
			summary: 'Deletes a student',
			tags: ['student'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			admin = admin.filter((c) => c.id !== id);

			return admin;
		},
	});

	server.route({
		method: 'GET',
		url: '/admin/:id',
		schema: {
			summary: 'Returns one student or null',
			tags: ['student'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
			response: {
				'2xx': Type.Union([Contact, Type.Null()]),
			},
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			return admin.find((c) => c.id === id) ?? null;
		},
	});

	server.route({
		method: 'GET',
		url: '/admin',
		schema: {
			summary: 'Gets all student',
			tags: ['student'],
			querystring: GetContactsQuery,
			response: {
				'2xx': Type.Array(Contact),
			},
		},
		handler: async (request, reply) => {
			const query = request.query as GetContactsQuery;

			if (query.name) {
				return admin.filter((c) => c.name.includes(query.name ?? ''));
			} else {
				return admin;
			}
		},
	});
}
