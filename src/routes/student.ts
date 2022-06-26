import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { upsertContactController } from '../controllers.ts/student';

const course = Type.Object({
	id: Type.String({ format: 'uuid' }),
	name: Type.String(),
	course_code: Type.String(),
	
});
type course = Static<typeof course>;

const GetContactsQuery = Type.Object({
	name: Type.Optional(Type.String()),
});
type GetContactsQuery = Static<typeof GetContactsQuery>;

export let student: course[] = [
	{ id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', name: 'Physics', course_code: '110' },
	{ id: '3fa85f64-5717-4562-b3fc-2c963f66afa5', name: 'Psychology', course_code: '123' },
	{ id: '3fa85f64-5717-4562-b3fc-2c963f66afa2', name: 'Electronics', course_code: '235' },
	{ id: '3fa85f64-5717-4562-b3fc-2c963f66afa1', name: 'Arithmetic', course_code: '643' },
	{ id: '3fa85f64-5717-4562-b3fc-2c963f66afa3', name: 'Literature', course_code: '423' },
	{ id: '3fa82f64-5117-4532-b3fc-2c943f66afa3', name: 'Calculus', course_code: '634' },
];

export default async function (server: FastifyInstance) {
	server.route({
		method: 'PUT',
		url: '/student',
		schema: {
			summary: 'Creates new course + all properties are required',
			tags: ['course'],
			body: course,
		},
		handler: async (request, reply) => {
			const newContact: any = request.body;
			return upsertContactController(student, newContact);
		},
	});

	server.route({
		method: 'PATCH',
		url: '/student/:id',
		schema: {
			summary: 'Update a course by id ',
			tags: ['course'],
			body: Type.Partial(course),
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const newContact: any = request.body;
			return upsertContactController(student, newContact);
		},
	});

	server.route({
		method: 'DELETE',
		url: '/student/:id',
		schema: {
			summary: 'Deletes a course',
			tags: ['course'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			student = student.filter((c) => c.id !== id);

			return student;
		},
	});

	server.route({
		method: 'GET',
		url: '/student/:id',
		schema: {
			summary: 'Returns one course or null',
			tags: ['course'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
			response: {
				'2xx': Type.Union([course, Type.Null()]),
			},
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			return student.find((c) => c.id === id) ?? null;
		},
	});

	server.route({
		method: 'GET',
		url: '/student',
		schema: {
			summary: 'Gets all course',
			tags: ['course'],
			querystring: GetContactsQuery,
			response: {
				'2xx': Type.Array(course),
			},
		},
		handler: async (request, reply) => {
			const query = request.query as GetContactsQuery;

			if (query.name) {
				return student.filter((c) => c.name.includes(query.name ?? ''));
			} else {
				return student;
			}
		},
	});
}
