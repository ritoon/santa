package control

import "apisanta/model"

func New() *Control {
	return &Control{}
}

type Control struct{}

func (c *Control) Register(u *model.User) error {
	// save user to database
	// send confirmation email
	return nil
}
