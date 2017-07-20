// This API uses the website

exports.install = function() {
	// COMMON
	F.route('/api/ping/',              json_ping , ['post']);

	// COMMENTS
	F.route('/api/comments/{id}/',     json_comments_query, ['*Comment']);
	F.route('/api/comments/',          json_comments_save, ['post', '*CommentForm']);

	// BLOGS
	F.route('/api/blogs/',             json_blogs_query, ['*Blog']);

	// NEWSLETTER
	F.route('/api/newsletter/',        json_save, ['post', '*Newsletter']);

	// CONTACTFORM
	F.route('/api/contact/',           json_save, ['post', '*Contact']);
};

// ==========================================================================
// COMMON
// ==========================================================================

function json_ping() {

	var self = this;
	var User = MODEL('client');
	sql.select('*', 'users').make(function(builder) {
		builder.where('id', '>', 5);
		builder.page(10, 10);
	});

	self.plain('null');
}

// ==========================================================================
// BLOGS
// ==========================================================================

function json_blogs_query() {
	var self = this;
	self.query.draft = false;
	self.$query(self, self.callback());
}

// ==========================================================================
// COMMENTS
// ==========================================================================

function json_comments_query(id) {
	var self = this;
	self.memorize('comments' + id, '1 minute', function() {
		self.query.idblog = id;
		self.query.max = 50;
		self.query.approved = true;
		self.$query(self, self.callback());
	});
}

function json_comments_save() {
	var self = this;
	self.$async(self.callback(), 1).$workflow('check', self).$save(self).$workflow('notify', self);
}

// ==========================================================================
// NEWSLETTER, CONTACTFORM
// ==========================================================================

// Appends a new email into the newsletter list
function json_save() {
	var self = this;
	self.body.$save(self.callback());
}

function view_index() {

	var self = this;

	// definitions/mysql.js
	// create a DB connection
	//DB(function(err, connection){
    //
	//	if(err != null) {
	//		self.throw500(err);
	//		return;
	//	}
    //
	//	// Table schema = { Id: Number, Age: Number, Name: String };
	//	connection.query('SELECT * FROM users', function(err, rows) {
    //
	//		// Close connection
	//		connection.release();
    //
	//		if (err != null) {
	//			self.view500(err);
	//			return;
	//		}
    //
	//		// Shows the result on a console window
	//		console.log(rows);
    //
	//		// Send rows as the model into the view
	//		//self.view('index', rows);
	//		self.plain('null');
    //
	//	});
    //
	//});
}