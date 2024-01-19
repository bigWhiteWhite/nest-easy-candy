const a = [
	{
		_id: 'b',
		parentMenu: {
			_id: 'a',
			parentMenu: null
		}
	},
	{
		_id: 'd',
		parentMenu: null
	},
	{
		_id: 'e',
		parentMenu: {
			_id: 'b',
			parentMenu: {
				_id: 'a',
				parentMenu: null
			}
		}
	}
]
const b = [
	{
		_id: 'a',
		parentMenu: null,
		children: [
			{
				_id: 'b',
				parentMenu: {
					_id: 'a',
					parentMenu: null
				},
				children: [
					{
						_id: 'e',
						parentMenu: {
							_id: 'b',
							parentMenu: {
								_id: 'a',
								parentMenu: null
							}
						},
						children: []
					}
				]
			}
		]
	},
	{
		_id: 'd',
		parentMenu: null,
		children: []
	}
]
