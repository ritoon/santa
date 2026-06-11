package model

import (
	"crypto/sha256"
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

// TODO
// création d'une structure LoginPayload
// Email
// Password

// Ajouter la méthode IsValidPassword
// param in pwd string
// param ou bool
