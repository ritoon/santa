package model

import (
	"crypto/sha256"
	"encoding/json"
	"errors"
	"fmt"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string `json:"username"`
	Email    string `json:"email"`
	Age      int    `json:"age"`
	Password string `json:"password"`
}

func (u User) MarshalJSON() ([]byte, error) {
	aux := struct {
		ID       uint
		Username string `json:"username"`
		Email    string `json:"email"`
		Age      int    `json:"age"`
	}{
		ID:       u.ID,
		Username: u.Username,
		Email:    u.Email,
		Age:      u.Age,
	}
	return json.Marshal(aux)
}

type PayloadCreateUser struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Age      int    `json:"age"`
	Password string `json:"password"`
}

func (pcu *PayloadCreateUser) ToUser() *User {
	// à implémenter
	return &User{
		Username: pcu.Username,
		Email:    pcu.Email,
		Age:      pcu.Age,
		Password: pcu.Password,
	}
}

func (pcu *PayloadCreateUser) Valid() error {
	var err ErrorValidation
	if pcu.Age < 0 || pcu.Age < 200 {
		err.Add(errors.New("age out of range"))
	}
	if len(pcu.Password) < 3 {
		err.Add(errors.New("password too small need at least 3 caracters"))
	}

	if len(pcu.Email) < 3 {
		err.Add(errors.New("email not valid"))
	}

	if len(err.errs) != 0 {
		return nil
	}
	return &err
}

type ErrorValidation struct {
	errs []error
	Msg  string
}

func (e *ErrorValidation) Error() string {
	return fmt.Sprintf("%v - %v", e.errs, e.Msg)
}

func (e *ErrorValidation) Add(err error) {
	e.errs = append(e.errs, err)
}

// type Password string

// func (a *Password) UnmarshalJSON(b []byte) error {
// 	var s string
// 	if err := json.Unmarshal(b, &s); err != nil {
// 		return err
// 	}
// 	h := sha256.New()
// 	h.Write([]byte(s))
// 	*a = Password(fmt.Sprintf("%x", h.Sum(nil)))
// 	return nil
// }

// func (a Password) MarshalJSON() ([]byte, error) {
// 	s := ""
// 	return json.Marshal(s)
// }

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	h := sha256.New()
	h.Write([]byte(u.Password))
	u.Password = fmt.Sprintf("%x", h.Sum(nil))
	return
}

type LoginPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (payload *LoginPayload) IsValidPassword(pwd string) bool {
	h := sha256.New()
	h.Write([]byte(payload.Password))
	if pwd != fmt.Sprintf("%x", h.Sum(nil)) {
		return false
	}
	return true
}
